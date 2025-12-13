"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { speak, getVoiceLang } from "@/utils/textToSpeech";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import VocabularyCard, { type Vocabulary } from "./VocabularyCard";
import QuizSection from "./QuizSection";
import CompletionScreen from "./CompletionScreen";
import { useTranslation } from "@/app/i18n/I18nProvider";

interface LearningSlideShowProps {
  vocabularies: Vocabulary[];
  chapterName: string;
  languageCode: string;
  forSpeakersOf: string;
  onClose: () => void;
}

export default function LearningSlideShow({
  vocabularies,
  chapterName,
  languageCode,
  forSpeakersOf,
  onClose,
}: LearningSlideShowProps) {
  const [vocabQueue, setVocabQueue] = useState<Vocabulary[]>(vocabularies);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [usedHint, setUsedHint] = useState(false);
  const [missedWords, setMissedWords] = useState<Vocabulary[]>([]);
  const [reviewing, setReviewing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {t} = useTranslation();

  const currentVocab = vocabQueue[currentIndex];
  const maxScore = vocabularies.length;
  const totalWords = reviewing ? missedWords.length : maxScore;
  const progress = (processedCount / totalWords) * 100;

  // Speech recognition hook - translation field contains target language answer
  const {
    isListening,
    spokenText,
    startListening,
    stopListening,
    resetSpokenText,
  } = useSpeechRecognition(currentVocab?.translation || "", languageCode, {
    onSuccess: () => {
      setShowSuccess(true);
      setShowHint(false);
      // Award point only if NOT in review phase and hint wasn't used
      if (!reviewing && !usedHint) {
        setScore(prev => Math.min(prev + 1, maxScore));
      }
      setTimeout(() => {
        setShowSuccess(false);
        handleNext();
      }, 1500);
    },
  });

  // Load voices
  useEffect(() => {
    if ("speechSynthesis" in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          console.log("Available voices:", voices.map(v => `${v.name} (${v.lang})`));
        }
      };

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

  // Handle speaking function - word is in native language (forSpeakersOf)
  const handleSpeak = useCallback(async (text: string) => {
    await speak(text, forSpeakersOf, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    }, audioRef);
  }, [forSpeakersOf]);

  // Auto-start listening after speech ends
  useEffect(() => {
    if (!isSpeaking && showTranslation && !showHint && !isListening && !showSuccess) {
      const timer = setTimeout(() => {
        startListening();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking, showTranslation, showHint, isListening, showSuccess, startListening]);

  // Auto-speak when vocabulary changes
  useEffect(() => {
    if (currentVocab && !showTranslation && !completed) {
      const timer = setTimeout(() => {
        handleSpeak(currentVocab.word);
        // Auto-reveal translation after speech
        setTimeout(() => {
          setShowTranslation(true);
        }, 2000);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentVocab, showTranslation, completed, handleSpeak]);

  const handleNext = () => {
    setShowTranslation(false);
    setShowSuccess(false);
    setShowHint(false);
    setUsedHint(false); // Reset hint flag
    resetSpokenText();
    stopListening();
    
    // Increment processed count
    setProcessedCount(prev => prev + 1);
    
    // Move to next word in queue
    if (currentIndex < vocabQueue.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (vocabQueue.length === vocabularies.length && processedCount + 1 < vocabularies.length) {
      // Still have words to process but reached end of initial queue
      setCurrentIndex(0);
    } else {
      // Main quiz complete - check if we have missed words to review
      if (missedWords.length > 0 && !reviewing) {
        setReviewing(true);
        setVocabQueue(missedWords);
        setCurrentIndex(0);
        setProcessedCount(0);
        setShowTranslation(false);
        setShowSuccess(false);
        setShowHint(false);
      } else {
        setCompleted(true);
      }
    }
  };

  const handleDontKnow = async () => {
    setShowHint(true);
    setUsedHint(true); // Mark that hint was used
    stopListening();
    
    // Track this word for review at the end (only if not already in review phase)
    if (!reviewing && !missedWords.find(w => w.id === currentVocab.id)) {
      setMissedWords(prev => [...prev, currentVocab]);
    }
    
    // Don't reschedule - just show the answer and let them practice
    // They won't get a point but will complete this word
    
    // Speak the translation in the target language
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentVocab.translation);
      const targetLanguageLocale = getVoiceLang(languageCode);
      utterance.lang = targetLanguageLocale;
      console.log(`🗣️ Speaking translation "${currentVocab.translation}" in target language: ${languageCode} (${targetLanguageLocale})`);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      setIsSpeaking(true);
      
      utterance.onend = () => {
        setIsSpeaking(false);
        // Auto-start listening after a short delay
        setTimeout(() => {
          startListening();
        }, 500);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleHearAgain = () => {
    stopListening(); // Stop listening first
    
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentVocab.translation);
      const targetLanguageLocale = getVoiceLang(languageCode);
      utterance.lang = targetLanguageLocale;
      console.log(`🗣️ Hear again: "${currentVocab.translation}" in target language: ${languageCode} (${targetLanguageLocale})`);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      setIsSpeaking(true);
      
      utterance.onend = () => {
        setIsSpeaking(false);
        // Auto-start listening after a short delay
        setTimeout(() => {
          startListening();
        }, 500);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRestart = () => {
    setVocabQueue(vocabularies);
    setCurrentIndex(0);
    setShowTranslation(false);
    setCompleted(false);
    setScore(0);
    setProcessedCount(0);
    setMissedWords([]);
    setReviewing(false);
  };

  if (completed) {
    return (
      <CompletionScreen
        chapterName={chapterName}
        vocabularyCount={vocabularies.length}
        score={score}
        maxScore={maxScore}
        missedWordsCount={missedWords.length}
        onRestart={handleRestart}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80">
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[98vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white truncate pr-2">
              {reviewing ? t("slideshow.wordsYouMissed") : chapterName}
            </h2>
            <div className="flex items-center gap-2 sm:gap-4">
              {!reviewing && (
                <div className="text-sm sm:text-base lg:text-lg font-bold text-primary whitespace-nowrap">
                  {t("slideshow.score")}: {score}/{maxScore}
                </div>
              )}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="relative h-1.5 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1.5 sm:mt-2 text-center">
            {reviewing ? (
              <>{t("slideshow.practice")} {processedCount} / {totalWords} {t("slideshow.missedWords")}</>
            ) : (
              <>{processedCount} / {maxScore} {t("slideshow.words")}</>
            )}
          </p>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Review Phase Message */}
          {reviewing && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-center text-orange-800 dark:text-orange-300 text-sm sm:text-base font-medium">
                {t("slideshow.letsPracticeWordsYouMissed")}
              </p>
            </div>
          )}
          
          <VocabularyCard
            vocabulary={currentVocab}
            isSpeaking={isSpeaking}
            onSpeak={() => handleSpeak(currentVocab.word)}
          />

          {showTranslation && (
            <QuizSection
              vocabulary={currentVocab}
              isListening={isListening}
              spokenText={spokenText}
              showSuccess={showSuccess}
              showHint={showHint}
              onStartListening={startListening}
              onStopListening={stopListening}
              onDontKnow={handleDontKnow}
              onHearAgain={handleHearAgain}
            />
          )}
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
