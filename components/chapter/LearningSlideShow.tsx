"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, X, ArrowRight, CheckCircle } from "lucide-react";
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    };
  }, []);

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

  const handleNext = () => {
    setShowTranslation(false);
    if (currentIndex < vocabularies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleRevealTranslation = () => {
    setShowTranslation(true);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowTranslation(false);
    setCompleted(false);
  };

  // Auto-speak when vocabulary changes
  useEffect(() => {
    if (currentVocab && !showTranslation) {
      const timer = setTimeout(() => {
        speak(currentVocab.word);
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

            {/* Translation (Hidden until revealed) */}
            {showTranslation ? (
              <div className="animate-fadeIn">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <h4 className="text-2xl font-bold text-green-800 dark:text-green-300">
                      {currentVocab.translation}
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

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  className="btn-primary px-8 py-3 rounded-full text-lg font-semibold inline-flex items-center gap-2"
                >
                  {currentIndex < vocabularies.length - 1 ? (
                    <>
                      Next Word
                      <ArrowRight className="w-5 h-5" />
                    </>
                  ) : (
                    "Complete Chapter"
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={handleRevealTranslation}
                className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-semibold"
              >
                Show Translation
              </button>
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
