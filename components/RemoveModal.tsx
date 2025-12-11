"use client";

import { useTranslation } from "@/app/i18n/I18nProvider";
import { X } from "lucide-react";

interface RemoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName: string;
  loading?: boolean;
}

export default function RemoveModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  loading = false,
}: RemoveModalProps) {
  const { t } = useTranslation();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-red-600 dark:text-red-400">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4">
            {description}
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-red-800 dark:text-red-300 font-semibold wrap-break-word">
              &ldquo;{itemName}&rdquo;
            </p>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            ⚠️ {t("common.thisActionCannotBeUndone")}
          </p>
        </div>

        {/* Buttons */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 sm:px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 order-2 sm:order-1"
          >
            {t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 sm:px-6 py-2 bg-red-600 text-white text-sm sm:text-base rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
          >
            {loading ? t("common.deleting") : t("common.delete")}
          </button>
        </div>
      </div>
    </div>
  );
}
