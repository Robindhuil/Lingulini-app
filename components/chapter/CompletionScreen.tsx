/**
 * Completion screen component
 * Shown when user finishes all vocabulary in a chapter
 */

"use client";

import { useEffect } from "react";
import { playCelebrationSound } from "@/utils/celebrationSounds";

interface CompletionScreenProps {
  chapterName: string;
  vocabularyCount: number;
  score: number;
  maxScore: number;
  missedWordsCount: number;
  onRestart: () => void;
  onClose: () => void;
}

export default function CompletionScreen({
  chapterName,
  vocabularyCount,
  score,
  maxScore,
  missedWordsCount,
  onRestart,
  onClose,
}: CompletionScreenProps) {
  const percentage = Math.round((score / maxScore) * 100);

  // Play celebration sound when component mounts
  useEffect(() => {
    playCelebrationSound(percentage);
  }, [percentage]);
  const emoji = percentage >= 90 ? "🎉" : percentage >= 70 ? "👏" : percentage >= 50 ? "👍" : "💪";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8 text-center">
        <div className="text-6xl mb-6">{emoji}</div>
        <h2 className="text-4xl font-black text-primary mb-4">
          Chapter Complete!
        </h2>
        
        {/* Score Display */}
        <div className="mb-6">
          <div className="text-5xl font-black text-primary mb-2">
            {score}/{maxScore}
          </div>
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            {percentage}% Correct
          </div>
        </div>

        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          You&apos;ve completed all {vocabularyCount} vocabulary items in {chapterName}
        </p>
        
        {/* Missed Words Info */}
        {missedWordsCount > 0 && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-base text-blue-800 dark:text-blue-300">
              📝 You reviewed <span className="font-bold">{missedWordsCount}</span> word{missedWordsCount !== 1 ? 's' : ''} you initially missed
            </p>
          </div>
        )}
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={onRestart}
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
