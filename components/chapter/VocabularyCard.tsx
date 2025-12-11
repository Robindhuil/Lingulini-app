/**
 * Vocabulary card component
 * Displays the word, pronunciation, image, and listen button
 */

import Image from "next/image";
import { Volume2 } from "lucide-react";
import { useTranslation } from "@/app/i18n/I18nProvider";

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
  const {t} = useTranslation();
  return (
    <div className="text-center px-4">
      {/* Image */}
      {vocabulary.imageUrl && (
        <div className="mb-4 sm:mb-6">
          <Image
            src={vocabulary.imageUrl}
            alt={vocabulary.word}
            width={448}
            height={300}
            className="max-w-full sm:max-w-md w-full mx-auto rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Type Badge */}
      <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 rounded-full text-xs sm:text-sm font-semibold text-primary mb-3 sm:mb-4">
        {vocabulary.type}
      </div>
      
      {/* Word */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-primary mb-3 sm:mb-4 wrap-break-word">
          {vocabulary.word}
        </h3>
        
        {/* Pronunciation */}
        {vocabulary.pronunciation && (
          <p className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 italic mb-3 sm:mb-4">
            [{vocabulary.pronunciation}]
          </p>
        )}

        {/* Listen Button */}
        <button
          onClick={onSpeak}
          disabled={isSpeaking}
          className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Volume2 className={`w-4 h-4 sm:w-5 sm:h-5 ${isSpeaking ? "animate-pulse" : ""}`} />
          {isSpeaking ? t("slideshow.playing") : t("slideshow.listen")}
        </button>
      </div>
    </div>
  );
}
