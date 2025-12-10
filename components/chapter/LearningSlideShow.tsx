"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, X, ArrowRight, CheckCircle, Mic, MicOff } from "lucide-react";
import { generateSpeech } from "@/app/actions/tts";

interface Vocabulary {
  id: number;
  word: string;
  translation: string;
  pronunciation: string | null;
  example: string | null;
  exampleTranslation: string | null;
  imageUrl: string | null;
  type: string;
}

interface LearningSlideShowProps {
  vocabularies: Vocabulary[];
  chapterName: string;
  languageCode: string;
  onClose: () => void;
}

export default function LearningSlideShow({
  vocabularies,
  chapterName,
  languageCode,
  onClose,
}: LearningSlideShowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const currentVocab = vocabularies[currentIndex];
  const progress = ((currentIndex + 1) / vocabularies.length) * 100;

  // Load voices (they might not be immediately available)
  useEffect(() => {
    if ("speechSynthesis" in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setVoicesLoaded(true);
          console.log("Available voices:", voices.map(v => `${v.name} (${v.lang})`));
        }
      };

      // Voices might load asynchronously
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Use the learning language for recognition (English translation)
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setIsListening(true);
        setSpokenText("");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        setSpokenText(transcript);
        console.log("Heard:", transcript);
        
        // Check if spoken text matches translation
        const correctTranslation = currentVocab.translation.toLowerCase().trim();
        const isCorrect = transcript === correctTranslation || 
                         transcript.includes(correctTranslation) ||
                         correctTranslation.includes(transcript);
        
        if (isCorrect) {
          setShowSuccess(true);
          setShowHint(false);
          setTimeout(() => {
            setShowSuccess(false);
            handleNext();
          }, 1500);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [currentVocab, currentIndex]);

  // Auto-start listening after speech ends
  useEffect(() => {
    if (!isSpeaking && showTranslation && !showHint && recognitionRef.current) {
      // Small delay before starting to listen
      const timer = setTimeout(() => {
        startListening();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking, showTranslation, showHint]);

  // Map language codes to speech synthesis language codes
  const getVoiceLang = (code: string): string => {
    const langMap: Record<string, string> = {
      en: "en-US",
      es: "es-ES",
      fr: "fr-FR",
      de: "de-DE",
      it: "it-IT",
      pt: "pt-PT",
      ja: "ja-JP",
      zh: "zh-CN",
      ko: "ko-KR",
      ru: "ru-RU",
      ar: "ar-SA",
      hi: "hi-IN",
      sk: "sk-SK", // Slovak
    };
    return langMap[code] || "sk-SK"; // Default to Slovak
  };

  const speak = async (text: string) => {
    // First, try browser's Web Speech API
    if ("speechSynthesis" in window) {
      const voices = window.speechSynthesis.getVoices();
      const targetLang = getVoiceLang(languageCode);
      const targetCode = languageCode.toLowerCase();

      console.log(`🗣️ Attempting to speak in language: ${languageCode} (${targetLang})`);

      // Look for a voice that matches the language
      const matchingVoice = voices.find(voice => {
        const voiceLang = voice.lang.toLowerCase();
        const voiceName = voice.name.toLowerCase();
        const targetFull = targetLang.toLowerCase();
        
        // Match by language code (sk, en, es, etc.)
        if (voiceLang.startsWith(targetCode)) return true;
        // Match by full locale (sk-SK, en-US, etc.)
        if (voiceLang === targetFull) return true;
        // Match by language name in voice name
        const langNames: Record<string, string[]> = {
          sk: ["slovak", "slovenský"],
          en: ["english"],
          es: ["spanish", "español"],
          de: ["german", "deutsch"],
          fr: ["french", "français"],
        };
        const nameVariants = langNames[targetCode] || [];
        if (nameVariants.some(name => voiceName.includes(name))) return true;
        
        return false;
      });

      // If browser has the voice, use it
      if (matchingVoice) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = targetLang;
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        utterance.voice = matchingVoice;

        console.log(`✅ Using browser voice: ${matchingVoice.name} (${matchingVoice.lang})`);

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
          console.error("Speech error:", e);
          setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
        return;
      }

      console.warn(`❌ No ${languageCode} voice found in browser`);
      console.warn(`Available voices:`, voices.map(v => `${v.name} (${v.lang})`));
    }

    // Fallback to server-side TTS using espeak-ng
    console.log(`🔄 Falling back to server-side TTS for ${languageCode}`);
    
    try {
      setIsSpeaking(true);
      const result = await generateSpeech(text, languageCode);
      
      if (result.success && result.audio) {
        // Create audio element and play
        const audio = new Audio(`data:${result.mimeType};base64,${result.audio}`);
        audioRef.current = audio;
        
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => {
          console.error("Audio playback error");
          setIsSpeaking(false);
        };
        
        console.log(`✅ Playing server-generated speech`);
        await audio.play();
      } else {
        console.error("Failed to generate speech:", result.error);
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("TTS fallback error:", error);
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Failed to start recognition:", error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleNext = () => {
    setShowTranslation(false);
    setShowSuccess(false);
    setShowHint(false);
    setSpokenText("");
    stopListening();
    if (currentIndex < vocabularies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleDontKnow = async () => {
    setShowHint(true);
    stopListening();
    
    // Speak the English translation
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentVocab.translation);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onend = () => {
        // Auto-start listening after hint is spoken
        setTimeout(() => {
          startListening();
        }, 500);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowTranslation(false);
    setCompleted(false);
  };

  // Auto-speak when vocabulary changes and auto-reveal translation after speech
  useEffect(() => {
    if (currentVocab && !showTranslation) {
      const timer = setTimeout(() => {
        speak(currentVocab.word);
        // Auto-reveal translation after speech
        setTimeout(() => {
          setShowTranslation(true);
        }, 2000); // Wait 2 seconds for speech to finish
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  if (completed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-4xl font-black text-primary mb-4">
            Chapter Complete!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            You've reviewed all {vocabularies.length} vocabulary items in {chapterName}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all font-semibold"
            >
              Review Again
            </button>
            <button
              onClick={onClose}
              className="btn-primary px-6 py-3 rounded-lg font-semibold"
            >
              Finish
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {chapterName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {/* Progress Bar */}
          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
            {currentIndex + 1} / {vocabularies.length}
          </p>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Image */}
          {currentVocab.imageUrl && (
            <div className="mb-6 text-center">
              <img
                src={currentVocab.imageUrl}
                alt={currentVocab.word}
                className="max-w-md w-full mx-auto rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Word Card */}
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-semibold text-primary mb-4">
              {currentVocab.type}
            </div>
            
            <div className="mb-6">
              <h3 className="text-5xl md:text-6xl font-black text-primary mb-4">
                {currentVocab.word}
              </h3>
              
              {currentVocab.pronunciation && (
                <p className="text-xl text-gray-500 dark:text-gray-400 italic mb-4">
                  [{currentVocab.pronunciation}]
                </p>
              )}

              {/* Speak Button */}
              <button
                onClick={() => speak(currentVocab.word)}
                disabled={isSpeaking}
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Volume2 className={`w-5 h-5 ${isSpeaking ? "animate-pulse" : ""}`} />
                {isSpeaking ? "Playing..." : "Listen"}
              </button>
            </div>

            {/* Translation Section - Shows after speech */}
            {showTranslation && (
              <div className="animate-fadeIn">
                {/* Voice Recognition Section - Before showing translation */}
                {!showSuccess && !showHint && (
                  <div className="mb-6 space-y-4">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                        What does "{currentVocab.word}" mean in English?
                      </p>
                      
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={isListening ? stopListening : startListening}
                          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all font-semibold ${
                            isListening
                              ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                              : "bg-blue-500 hover:bg-blue-600 text-white"
                          }`}
                        >
                          {isListening ? (
                            <>
                              <MicOff className="w-5 h-5" />
                              Listening...
                            </>
                          ) : (
                            <>
                              <Mic className="w-5 h-5" />
                              Speak the Answer
                            </>
                          )}
                        </button>

                        <button
                          onClick={handleDontKnow}
                          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-all font-semibold"
                        >
                          I Don't Know
                        </button>
                      </div>
                    </div>

                    {spokenText && (
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">You said:</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          "{spokenText}"
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Hint Section - After clicking "I Don't Know" */}
                {showHint && !showSuccess && (
                  <div className="mb-6 space-y-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-2xl p-6">
                      <div className="text-center mb-4">
                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                          The answer is:
                        </p>
                        <h4 className="text-3xl font-bold text-blue-800 dark:text-blue-300 mb-3">
                          {currentVocab.translation}
                        </h4>
                        <button
                          onClick={() => {
                            if ("speechSynthesis" in window) {
                              window.speechSynthesis.cancel();
                              const utterance = new SpeechSynthesisUtterance(currentVocab.translation);
                              utterance.lang = "en-US";
                              utterance.rate = 0.8;
                              window.speechSynthesis.speak(utterance);
                            }
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all text-sm font-semibold"
                        >
                          <Volume2 className="w-4 h-4" />
                          Hear it Again
                        </button>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                          Now repeat it to continue
                        </p>
                      </div>
                    </div>

                    <div className="text-center">
                      <button
                        onClick={isListening ? stopListening : startListening}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all font-semibold ${
                          isListening
                            ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        {isListening ? (
                          <>
                            <MicOff className="w-5 h-5" />
                            Listening...
                          </>
                        ) : (
                          <>
                            <Mic className="w-5 h-5" />
                            Repeat the Answer
                          </>
                        )}
                      </button>
                    </div>

                    {spokenText && (
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">You said:</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          "{spokenText}"
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Success Message with Translation Reveal */}
                {showSuccess && (
                  <>
                    <div className="bg-green-100 dark:bg-green-900/30 rounded-2xl p-6 mb-6">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        <h4 className="text-2xl font-bold text-green-800 dark:text-green-300">
                          Correct! It's "{currentVocab.translation}"
                        </h4>
                      </div>
                      
                      {currentVocab.example && (
                        <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                          <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                            📝 {currentVocab.example}
                          </p>
                          {currentVocab.exampleTranslation && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {currentVocab.exampleTranslation}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                      <div className="bg-green-500 text-white px-8 py-6 rounded-2xl shadow-2xl animate-bounce">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-8 h-8" />
                          <span className="text-2xl font-bold">Correct! 🎉</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Skip/Next Button */}
                <button
                  onClick={handleNext}
                  className="btn-secondary px-6 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2"
                >
                  Skip
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add fadeIn animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
