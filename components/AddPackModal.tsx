"use client";

import { useState, useEffect } from "react";
import { createPack, updatePack } from "@/app/actions/packs";
import { X } from "lucide-react";

interface Pack {
  id: number;
  courseId: number;
  title: string;
  description: string | null;
  emoji: string | null;
  order: number;
  isPublished: boolean;
}

interface AddPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
  courseName: string;
  editPack?: Pack | null;
}

export default function AddPackModal({ isOpen, onClose, courseId, courseName, editPack = null }: AddPackModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    emoji: "📦",
    isPublished: false,
  });

  // Populate form when editing
  useEffect(() => {
    if (editPack) {
      setFormData({
        title: editPack.title,
        description: editPack.description || "",
        emoji: editPack.emoji || "📦",
        isPublished: editPack.isPublished,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        emoji: "📦",
        isPublished: false,
      });
    }
  }, [editPack, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = editPack
        ? await updatePack(editPack.id, formData)
        : await createPack({
            courseId,
            ...formData,
          });
      
      if (result.success) {
        onClose();
      } else {
        setError(result.error || `Failed to ${editPack ? 'update' : 'create'} pack`);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary">
              {editPack ? "Edit Pack ✏️" : "Add New Pack 📦"}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              for {courseName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Pack Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., Basic Greetings, Food & Dining"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
              placeholder="Brief description of what this pack teaches..."
            />
          </div>

          {/* Emoji */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Emoji
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.emoji}
                onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                className="w-20 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-2xl"
                maxLength={2}
              />
              <div className="flex gap-2 flex-wrap">
                {["📦", "📚", "🎯", "🌟", "💬", "🍽️", "✈️", "🏠", "👋", "❤️"].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData({ ...formData, emoji })}
                    className="w-10 h-10 text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Published */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isPublished" className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
              Publish immediately
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (editPack ? "Updating..." : "Creating...") : (editPack ? "Update Pack" : "Create Pack")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
