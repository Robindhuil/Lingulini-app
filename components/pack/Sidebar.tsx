"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

interface Chapter {
  id: number;
  title: string;
  description: string | null;
  order: number;
  isPublished: boolean;
  _count: {
    vocabularies: number;
  };
}

interface SidebarProps {
  chapters: Chapter[];
  currentChapterId?: number;
  packId: number;
  languageCode: string;
  isAdmin: boolean;
  onAddChapter: () => void;
}

export default function Sidebar({ 
  chapters, 
  currentChapterId, 
  packId, 
  languageCode,
  isAdmin,
  onAddChapter 
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <div className="fixed left-0 top-20 h-[calc(100vh-5rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg z-40">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Expand sidebar"
        >
          <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg overflow-y-auto z-40">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Chapters</h3>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          aria-label="Collapse sidebar"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Chapters List */}
      <div className="p-4 space-y-2">
        {chapters.map((chapter, index) => {
          const isActive = currentChapterId === chapter.id;
          
          return (
            <Link
              key={chapter.id}
              href={`/packs/${languageCode}/pack/${packId}/chapter/${chapter.id}`}
              className={`block p-3 rounded-lg transition-all ${
                isActive
                  ? "bg-primary text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isActive ? "bg-white text-primary" : "bg-primary text-white"
                }`}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-1 truncate">
                    {chapter.title}
                  </h4>
                  <p className="text-xs opacity-80">
                    {chapter._count.vocabularies} words
                  </p>
                  {!chapter.isPublished && isAdmin && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-500 text-white text-xs rounded">
                      Draft
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}

        {/* Add Chapter Button */}
        {isAdmin && (
          <button
            onClick={onAddChapter}
            className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-gray-600 dark:text-gray-400 hover:text-primary"
          >
            <div className="flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              <span className="text-sm font-semibold">Add Chapter</span>
            </div>
          </button>
        )}
      </div>

      {/* Empty State */}
      {chapters.length === 0 && !isAdmin && (
        <div className="p-8 text-center">
          <div className="text-4xl mb-2">📖</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No chapters yet
          </p>
        </div>
      )}
    </div>
  );
}
