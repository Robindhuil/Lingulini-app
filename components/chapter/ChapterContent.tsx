"use client";

import { useState } from "react";
import AddVocabularyModal from "@/components/AddVocabularyModal";
import LearningSlideShow from "@/components/chapter/LearningSlideShow";
import Sidebar from "@/components/pack/Sidebar";
import { Plus, Volume2, Image as ImageIcon, BookOpen, PlayCircle } from "lucide-react";

interface Vocabulary {
  id: number;
  word: string;
  translation: string;
  pronunciation: string | null;
  audioUrl: string | null;
  imageUrl: string | null;
  example: string | null;
  exampleTranslation: string | null;
  type: string;
  order: number;
}

interface Chapter {
  id: number;
  packId: number;
  title: string;
  description: string | null;
  order: number;
  isPublished: boolean;
  _count: {
    vocabularies: number;
  };
}

interface ChapterData {
  id: number;
  title: string;
  description: string | null;
  pack: {
    id: number;
    title: string;
    emoji: string | null;
    course: {
      languageCode: string;
      forSpeakersOf: string;
    };
  };
}

interface ChapterContentProps {
  chapter: ChapterData;
  chapters: Chapter[];
  vocabularies: Vocabulary[];
  isAdmin: boolean;
}

export default function ChapterContent({ 
  chapter, 
  chapters, 
  vocabularies, 
  isAdmin 
}: ChapterContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVocab, setSelectedVocab] = useState<Vocabulary | null>(null);
  const [isLearningMode, setIsLearningMode] = useState(false);

  const hasVocabularies = vocabularies.length > 0;

  return (
    <>
      {/* Sidebar */}
      <Sidebar
        chapters={chapters}
        currentChapterId={chapter.id}
        packId={chapter.pack.id}
        languageCode={chapter.pack.course.languageCode}
        isAdmin={isAdmin}
        onAddChapter={() => {}}
      />

      {/* Main Content */}
      <div className="ml-80 min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          {/* Chapter Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>{chapter.pack.emoji || "📦"}</span>
              <span>{chapter.pack.title}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-primary mb-2">
              {chapter.title}
            </h1>
            {chapter.description && (
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {chapter.description}
              </p>
            )}
          </div>

          {/* Start Chapter Button - For All Users (when vocabulary exists) */}
          {hasVocabularies && (
            <button
              onClick={() => setIsLearningMode(true)}
              className="mb-8 btn-primary px-8 py-4 rounded-2xl flex items-center gap-3 mx-auto text-lg font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <PlayCircle className="w-6 h-6" />
              Start Chapter: {chapter.title}
            </button>
          )}

          {/* Admin Add Button */}
          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="mb-6 btn-secondary px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Add Vocabulary
            </button>
          )}

          {/* Vocabulary List - Only for Admin */}
          {isAdmin && vocabularies.length > 0 && (
            <div className="space-y-4">
              {vocabularies.map((vocab, index) => (
                <div
                  key={vocab.id}
                  className="card-playful p-6 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedVocab(selectedVocab?.id === vocab.id ? null : vocab)}
                >
                  <div className="flex items-start gap-4">
                    {/* Number Badge */}
                    <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-2xl font-bold text-primary mb-1">
                            {vocab.word}
                          </h3>
                          <p className="text-lg text-gray-700 dark:text-gray-300">
                            {vocab.translation}
                          </p>
                          {vocab.pronunciation && (
                            <p className="text-sm text-gray-500 dark:text-gray-500 italic mt-1">
                              {vocab.pronunciation}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {vocab.audioUrl && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // TODO: Play audio
                              }}
                              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              title="Play audio"
                            >
                              <Volume2 className="w-5 h-5 text-primary" />
                            </button>
                          )}
                          {vocab.imageUrl && (
                            <div className="p-2 rounded-full" title="Has image">
                              <ImageIcon className="w-5 h-5 text-secondary" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Type Badge */}
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        vocab.type === "WORD" 
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : vocab.type === "PHRASE"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                      }`}>
                        {vocab.type}
                      </span>

                      {/* Expandable Example */}
                      {selectedVocab?.id === vocab.id && (vocab.example || vocab.imageUrl) && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          {vocab.imageUrl && (
                            <div className="mb-4">
                              <img 
                                src={vocab.imageUrl} 
                                alt={vocab.word}
                                className="w-full max-w-md mx-auto rounded-lg shadow-md"
                              />
                            </div>
                          )}
                          {vocab.example && (
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                              <div className="flex items-start gap-2 mb-2">
                                <BookOpen className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-gray-900 dark:text-white font-medium">
                                    {vocab.example}
                                  </p>
                                  {vocab.exampleTranslation && (
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                      {vocab.exampleTranslation}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {vocabularies.length === 0 && (
            <div className="card-playful p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                No vocabulary yet
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-6">
                {isAdmin 
                  ? "Start building this chapter by adding vocabulary items!"
                  : "Check back soon for new content!"}
              </p>
              {isAdmin && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-primary px-6 py-3 rounded-lg inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add First Vocabulary
                </button>
              )}
            </div>
          )}

          {/* Progress Summary - Only for Admin */}
          {vocabularies.length > 0 && isAdmin && (
            <div className="mt-8 card-playful p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                📊 Chapter Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {vocabularies.length}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Total Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {vocabularies.filter(v => v.type === "WORD").length}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Words</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {vocabularies.filter(v => v.type === "PHRASE").length}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Phrases</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {vocabularies.filter(v => v.type === "SENTENCE").length}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Sentences</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Vocabulary Modal */}
      <AddVocabularyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        chapterId={chapter.id}
        chapterName={chapter.title}
      />

      {/* Learning SlideShow */}
      {isLearningMode && hasVocabularies && (
        <LearningSlideShow
          vocabularies={vocabularies}
          chapterName={chapter.title}
          languageCode={chapter.pack.course.forSpeakersOf}
          onClose={() => setIsLearningMode(false)}
        />
      )}
    </>
  );
}
