/**
 * Quiz section component
 * Handles the interactive quiz with speech recognition and hints
 */

import { Mic, MicOff, Volume2, CheckCircle } from "lucide-react";
import type { Vocabulary } from "./VocabularyCard";
import { useTranslation } from "@/app/i18n/I18nProvider";

interface QuizSectionProps {
  vocabulary: Vocabulary;
  isListening: boolean;
  spokenText: string;
  showSuccess: boolean;
  showHint: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onDontKnow: () => void;
  onHearAgain: () => void;
}

export default function QuizSection({
  vocabulary,
  isListening,
  spokenText,
  showSuccess,
  showHint,
  onStartListening,
  onStopListening,
  onDontKnow,
  onHearAgain,
}: QuizSectionProps) {
  const {t} = useTranslation();
  return (
    <div className="animate-fadeIn">
      {/* Quiz Mode - Before showing translation */}
      {!showSuccess && !showHint && (
        <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4 px-4">
          <div className="text-center">
            <p className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 wrap-break-word">
               {t("slideshow.quiz.whatDoesItMean")} &ldquo;{vocabulary.word}&rdquo;?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
              <button
                onClick={isListening ? onStopListening : onStartListening}
                className={`inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all text-sm sm:text-base font-semibold ${
                  isListening
                    ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t("slideshow.quiz.listening")}
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t("slideshow.quiz.repeatTheAnswer")}
                  </>
                )}
              </button>

              <button
                onClick={onDontKnow}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-all text-sm sm:text-base font-semibold"
              >
                {t("slideshow.quiz.iDontKnow")}
              </button>
            </div>
          </div>

          {spokenText && (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">{t("slideshow.quiz.youSaid")}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                &ldquo;{spokenText}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}

      {/* Hint Section - After clicking "I Don't Know" */}
      {showHint && !showSuccess && (
        <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4 px-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="text-center mb-3 sm:mb-4">
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-2">
                {t("slideshow.quiz.correctAnswer")}
              </p>
              <h4 className="text-2xl sm:text-3xl font-bold text-blue-800 dark:text-blue-300 mb-3 wrap-break-word">
                {vocabulary.translation}
              </h4>
              <button
                onClick={onHearAgain}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all text-xs sm:text-sm font-semibold"
              >
                <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
                {t("slideshow.quiz.hearItAgain")}
              </button>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                {t("slideshow.quiz.nowRepeatItToContinue")}
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={isListening ? onStopListening : onStartListening}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all font-semibold ${
                isListening
                  ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5" />
                  {t("slideshow.quiz.listening")}
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  {t("slideshow.quiz.repeatTheAnswer")}
                </>
              )}
            </button>
          </div>

          {spokenText && (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">{t("slideshow.quiz.youSaid")}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                &ldquo;{spokenText}&rdquo;
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
                {t("slideshow.quiz.correct")} &ldquo;{vocabulary.translation}&rdquo;
              </h4>
            </div>
            
            {vocabulary.example && (
              <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                  📝 {vocabulary.example}
                </p>
                {vocabulary.exampleTranslation && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {vocabulary.exampleTranslation}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-green-500 text-white px-8 py-6 rounded-2xl shadow-2xl animate-bounce">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8" />
                <span className="text-2xl font-bold">{t("slideshow.quiz.correct")} 🎉</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
