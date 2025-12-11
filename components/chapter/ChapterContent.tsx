"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AddVocabularyModal from "@/components/AddVocabularyModal";
import AddChapterModal from "@/components/AddChapterModal";
import RemoveModal from "@/components/RemoveModal";
import { deleteVocabulary } from "@/app/actions/vocabulary";
import { deleteChapter } from "@/app/actions/chapters";
import LearningSlideShow from "@/components/chapter/LearningSlideShow";
import Sidebar from "@/components/pack/Sidebar";
import { Plus, Volume2, Image as ImageIcon, BookOpen, PlayCircle, Pencil, Trash2 } from "lucide-react";

interface Vocabulary {
  id: number;
  chapterId: number;
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
  const [editingVocab, setEditingVocab] = useState<Vocabulary | null>(null);
  const [selectedVocab, setSelectedVocab] = useState<Vocabulary | null>(null);
  const [isLearningMode, setIsLearningMode] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [vocabToDelete, setVocabToDelete] = useState<Vocabulary | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Chapter editing/deletion state
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [isChapterRemoveModalOpen, setIsChapterRemoveModalOpen] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<Chapter | null>(null);
  const [chapterDeleteLoading, setChapterDeleteLoading] = useState(false);
  
  const router = useRouter();

  const hasVocabularies = vocabularies.length > 0;

  const handleEditVocab = (vocab: Vocabulary, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingVocab(vocab);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (vocab: Vocabulary, e: React.MouseEvent) => {
    e.stopPropagation();
    setVocabToDelete(vocab);
    setIsRemoveModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!vocabToDelete) return;
    
    setDeleteLoading(true);
    try {
      const result = await deleteVocabulary(vocabToDelete.id);
      if (result.success) {
        setIsRemoveModalOpen(false);
        setVocabToDelete(null);
        router.refresh();
      } else {
        alert(result.error || "Failed to delete vocabulary");
      }
    } catch {
      alert("An unexpected error occurred");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVocab(null);
    router.refresh();
  };

  // Chapter handlers
  const handleEditChapter = (chapterToEdit: Chapter) => {
    setEditingChapter(chapterToEdit);
    setIsChapterModalOpen(true);
  };

  const handleDeleteChapter = (chapterToRemove: Chapter) => {
    setChapterToDelete(chapterToRemove);
    setIsChapterRemoveModalOpen(true);
  };

  const handleConfirmChapterDelete = async () => {
    if (!chapterToDelete) return;
    
    setChapterDeleteLoading(true);
    try {
      const result = await deleteChapter(chapterToDelete.id);
      if (result.success) {
        setIsChapterRemoveModalOpen(false);
        setChapterToDelete(null);
        // Navigate to pack page after deleting current chapter
        router.push(`/packs/${chapter.pack.course.languageCode}/pack/${chapter.pack.id}`);
        router.refresh();
      } else {
        alert(result.error || "Failed to delete chapter");
      }
    } catch {
      alert("An unexpected error occurred");
    } finally {
      setChapterDeleteLoading(false);
    }
  };

  const handleCloseChapterModal = () => {
    setIsChapterModalOpen(false);
    setEditingChapter(null);
    router.refresh();
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar
        chapters={chapters}
        currentChapterId={chapter.id}
        packId={chapter.pack.id}
        languageCode={chapter.pack.course.languageCode}
        isAdmin={isAdmin}
        onAddChapter={() => setIsChapterModalOpen(true)}
        onEditChapter={handleEditChapter}
        onDeleteChapter={handleDeleteChapter}
        isMobileOpen={isSidebarOpen}
        onMobileClose={() => setIsSidebarOpen(false)}
      />

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-30 p-4 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all"
        aria-label="Open chapters menu"
      >
        <BookOpen className="w-6 h-6" />
      </button>

      {/* Main Content */}
      <div className="lg:ml-80 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Chapter Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>{chapter.pack.emoji || "📦"}</span>
              <span>{chapter.pack.title}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary mb-2">
              {chapter.title}
            </h1>
            {chapter.description && (
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                {chapter.description}
              </p>
            )}
          </div>

          {/* Start Chapter Button - For All Users (when vocabulary exists) */}
          {hasVocabularies && (
            <button
              onClick={() => setIsLearningMode(true)}
              className="mb-6 sm:mb-8 btn-primary px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 mx-auto text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto justify-center"
            >
              <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="truncate">Start Chapter: {chapter.title}</span>
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
            <div className="space-y-3 sm:space-y-4">
              {vocabularies.map((vocab, index) => (
                <div
                  key={vocab.id}
                  className="relative group card-playful p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedVocab(selectedVocab?.id === vocab.id ? null : vocab)}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Number Badge */}
                    <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm sm:text-base font-bold">
                      {index + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary mb-1 wrap-break-word">
                            {vocab.word}
                          </h3>
                          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 wrap-break-word">
                            {vocab.translation}
                          </p>
                          {vocab.pronunciation && (
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 italic mt-1">
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
                            <div className="mb-4 relative w-full max-w-md mx-auto">
                              <Image 
                                src={vocab.imageUrl} 
                                alt={vocab.word}
                                width={448}
                                height={300}
                                className="rounded-lg shadow-md"
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

                  {/* Admin Actions */}
                  <div className="absolute top-4 right-4 flex gap-2 transition-opacity">
                    <button
                      onClick={(e) => handleEditVocab(vocab, e)}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                      title="Edit vocabulary"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(vocab, e)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
                      title="Delete vocabulary"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}          {/* Empty State */}
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

      {/* Add/Edit Vocabulary Modal */}
      <AddVocabularyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        chapterId={chapter.id}
        chapterName={chapter.title}
        editVocabulary={editingVocab}
      />

      {/* Delete Confirmation Modal */}
      {vocabToDelete && (
        <RemoveModal
          isOpen={isRemoveModalOpen}
          onClose={() => {
            setIsRemoveModalOpen(false);
            setVocabToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Vocabulary"
          description="Are you sure you want to delete this vocabulary item?"
          itemName={`${vocabToDelete.word} - ${vocabToDelete.translation}`}
          loading={deleteLoading}
        />
      )}

      {/* Add/Edit Chapter Modal */}
      <AddChapterModal
        isOpen={isChapterModalOpen}
        onClose={handleCloseChapterModal}
        packId={chapter.pack.id}
        packName={chapter.pack.title}
        editChapter={editingChapter}
      />

      {/* Delete Chapter Confirmation Modal */}
      {chapterToDelete && (
        <RemoveModal
          isOpen={isChapterRemoveModalOpen}
          onClose={() => {
            setIsChapterRemoveModalOpen(false);
            setChapterToDelete(null);
          }}
          onConfirm={handleConfirmChapterDelete}
          title="Delete Chapter"
          description="Are you sure you want to delete this chapter? This will also delete all associated vocabulary words."
          itemName={chapterToDelete.title}
          loading={chapterDeleteLoading}
        />
      )}

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
