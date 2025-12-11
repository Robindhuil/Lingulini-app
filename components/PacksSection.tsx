"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AddPackModal from "@/components/AddPackModal";
import RemoveModal from "@/components/RemoveModal";
import { deletePack } from "@/app/actions/packs";
import { Plus, Book, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface Pack {
  id: number;
  courseId: number;
  title: string;
  description: string | null;
  emoji: string | null;
  order: number;
  isPublished: boolean;
  _count: {
    chapters: number;
  };
}

interface PacksSectionProps {
  packs: Pack[];
  courseId: number;
  courseName: string;
  languageCode: string;
  isAdmin: boolean;
}

export default function PacksSection({ 
  packs, 
  courseId, 
  courseName, 
  languageCode,
  isAdmin 
}: PacksSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPack, setEditingPack] = useState<Pack | null>(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [packToDelete, setPackToDelete] = useState<Pack | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();

  const handleEditPack = (pack: Pack, e: React.MouseEvent) => {
    e.preventDefault();
    setEditingPack(pack);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (pack: Pack, e: React.MouseEvent) => {
    e.preventDefault();
    setPackToDelete(pack);
    setIsRemoveModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!packToDelete) return;
    
    setDeleteLoading(true);
    try {
      const result = await deletePack(packToDelete.id);
      if (result.success) {
        setIsRemoveModalOpen(false);
        setPackToDelete(null);
        router.refresh();
      } else {
        alert(result.error || "Failed to delete pack");
      }
    } catch {
      alert("An unexpected error occurred");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPack(null);
    router.refresh();
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 text-primary">
            {courseName} Packs 📚
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Choose a pack to start learning
          </p>
        </div>

        {/* Packs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {packs.map((pack) => (
            <div key={pack.id} className="relative group">
              <Link
                href={`/packs/${languageCode}/pack/${pack.id}`}
                className="block card-playful p-4 sm:p-6 hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-primary"
              >
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 text-center">{pack.emoji || "📦"}</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-primary text-center">
                  {pack.title}
                </h3>
                {pack.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                    {pack.description}
                  </p>
                )}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                  <Book className="w-4 h-4" />
                  <span>{pack._count.chapters} chapters</span>
                </div>
                {!pack.isPublished && isAdmin && (
                  <div className="mt-3 text-center">
                    <span className="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs rounded-full">
                      Draft
                    </span>
                  </div>
                )}
              </Link>

              {/* Admin Actions */}
              {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-2 transition-opacity">
                  <button
                    onClick={(e) => handleEditPack(pack, e)}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                    title="Edit pack"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(pack, e)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
                    title="Delete pack"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add Pack Button - Only for Admins */}
          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="card-playful p-6 border-4 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
            >
              <div className="text-center">
                <Plus className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400">
                  Add New Pack
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Create a new learning pack
                </p>
              </div>
            </button>
          )}
        </div>

        {/* Empty State */}
        {packs.length === 0 && !isAdmin && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
              No packs available yet
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Check back soon for new learning content!
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Pack Modal */}
      <AddPackModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        courseId={courseId}
        courseName={courseName}
        editPack={editingPack}
      />

      {/* Delete Confirmation Modal */}
      {packToDelete && (
        <RemoveModal
          isOpen={isRemoveModalOpen}
          onClose={() => {
            setIsRemoveModalOpen(false);
            setPackToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Pack"
          description="Are you sure you want to delete this pack? This will also delete all associated chapters and vocabulary."
          itemName={packToDelete.title}
          loading={deleteLoading}
        />
      )}
    </>
  );
}
