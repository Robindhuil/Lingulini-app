/**
 * Vocabulary card component
 * Displays the word, pronunciation, image, and listen button
 */

import { Volume2 } from "lucide-react";

export interface Vocabulary {
  id: number;
  word: string;
  translation: string;
  pronunciation: string | null;
  example: string | null;
  exampleTranslation: string | null;
  imageUrl: string | null;
  type: string;
}

interface VocabularyCardProps {
  vocabulary: Vocabulary;
  isSpeaking: boolean;
  onSpeak: () => void;
}

export default function VocabularyCard({
  vocabulary,
  isSpeaking,
  onSpeak,
}: VocabularyCardProps) {
  return (
    <div className="text-center">
      {/* Image */}
      {vocabulary.imageUrl && (
        <div className="mb-6">
          <img
            src={vocabulary.imageUrl}
            alt={vocabulary.word}
            className="max-w-md w-full mx-auto rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Type Badge */}
      <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-semibold text-primary mb-4">
        {vocabulary.type}
      </div>
      
      {/* Word */}
      <div className="mb-6">
        <h3 className="text-5xl md:text-6xl font-black text-primary mb-4">
          {vocabulary.word}
        </h3>
        
        {/* Pronunciation */}
        {vocabulary.pronunciation && (
          <p className="text-xl text-gray-500 dark:text-gray-400 italic mb-4">
            [{vocabulary.pronunciation}]
          </p>
        )}

        {/* Listen Button */}
        <button
          onClick={onSpeak}
          disabled={isSpeaking}
          className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Volume2 className={`w-5 h-5 ${isSpeaking ? "animate-pulse" : ""}`} />
          {isSpeaking ? "Playing..." : "Listen"}
        </button>
      </div>
    </div>
  );
}
