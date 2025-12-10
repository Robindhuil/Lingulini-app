"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AddChapterModal from "@/components/AddChapterModal";
import RemoveModal from "@/components/RemoveModal";
import { deleteChapter } from "@/app/actions/chapters";
import Sidebar from "@/components/pack/Sidebar";

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

interface Pack {
  id: number;
  title: string;
  emoji: string | null;
  course: {
    languageCode: string;
  };
}

interface PackContentProps {
  pack: Pack;
  chapters: Chapter[];
  isAdmin: boolean;
  currentChapterId?: number;
}

export default function PackContent({ pack, chapters, isAdmin, currentChapterId }: PackContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<Chapter | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();

  const handleEditChapter = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (chapter: Chapter) => {
    setChapterToDelete(chapter);
    setIsRemoveModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!chapterToDelete) return;
    
    setDeleteLoading(true);
    try {
      const result = await deleteChapter(chapterToDelete.id);
      if (result.success) {
        setIsRemoveModalOpen(false);
        setChapterToDelete(null);
        router.refresh();
      } else {
        alert(result.error || "Failed to delete chapter");
      }
    } catch (error) {
      alert("An unexpected error occurred");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingChapter(null);
    router.refresh();
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar
        chapters={chapters}
        currentChapterId={currentChapterId}
        packId={pack.id}
        languageCode={pack.course.languageCode}
        isAdmin={isAdmin}
        onAddChapter={() => setIsModalOpen(true)}
        onEditChapter={handleEditChapter}
        onDeleteChapter={handleDeleteClick}
      />

      {/* Main Content */}
      <div className="ml-80 min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          {/* Pack Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">{pack.emoji || "📦"}</div>
            <h1 className="text-4xl md:text-5xl font-black text-primary mb-4">
              {pack.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Select a chapter from the sidebar to start learning
            </p>
          </div>

          {/* Welcome Card */}
          <div className="card-playful p-8 text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Welcome to {pack.title}! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This pack contains {chapters.length} chapter{chapters.length !== 1 ? "s" : ""} to help you learn.
              Choose a chapter from the sidebar to begin your journey!
            </p>
            {chapters.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {chapters.length}
                  </span>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Chapters</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-lg">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {chapters.reduce((sum, ch) => sum + ch._count.vocabularies, 0)}
                  </span>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">Total Words</p>
                </div>
              </div>
            )}
          </div>

          {/* Tips Card */}
          <div className="mt-8 bg-linear-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              💡 Learning Tips
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Complete chapters in order for the best learning experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Practice regularly - even 10 minutes a day makes a difference</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Review previous chapters to reinforce your memory</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add/Edit Chapter Modal */}
      <AddChapterModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        packId={pack.id}
        packName={pack.title}
        editChapter={editingChapter}
      />

      {/* Delete Confirmation Modal */}
      {chapterToDelete && (
        <RemoveModal
          isOpen={isRemoveModalOpen}
          onClose={() => {
            setIsRemoveModalOpen(false);
            setChapterToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Chapter"
          description="Are you sure you want to delete this chapter? This will also delete all associated vocabulary words."
          itemName={chapterToDelete.title}
          loading={deleteLoading}
        />
      )}
    </>
  );
}
