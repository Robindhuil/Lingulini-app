"use client";

import { useState, useEffect } from "react";
import { createCourse, updateCourse } from "@/app/actions/courses";
import { X } from "lucide-react";
import { useTranslation } from "@/app/i18n/I18nProvider";

interface Course {
  id: number;
  title: string;
  description: string | null;
  languageCode: string;
  forSpeakersOf: string;
  level: string;
  emoji: string | null;
  isPublished: boolean;
}

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  editCourse?: Course | null;
}

const languageOptions = [
  { code: "sk", name: "Slovak", flag: "🇸🇰" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
];

export default function AddCourseModal({ isOpen, onClose, editCourse = null }: AddCourseModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {t} = useTranslation();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    languageCode: "",
    forSpeakersOf: "en",
    level: "BEGINNER" as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
    emoji: "🌍",
    isPublished: false,
  });

  // Populate form when editing
  useEffect(() => {
    if (editCourse) {
      setFormData({
        title: editCourse.title,
        description: editCourse.description || "",
        languageCode: editCourse.languageCode,
        forSpeakersOf: editCourse.forSpeakersOf,
        level: editCourse.level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
        emoji: editCourse.emoji || "🌍",
        isPublished: editCourse.isPublished,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        languageCode: "",
        forSpeakersOf: "en",
        level: "BEGINNER",
        emoji: "🌍",
        isPublished: false,
      });
    }
  }, [editCourse, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = editCourse
        ? await updateCourse(editCourse.id, formData)
        : await createCourse(formData);
      
      if (result.success) {
        onClose();
      } else {
        setError(result.error || `Failed to ${editCourse ? 'update' : 'create'} course`);
      }
    } catch {
      setError(t("common.error"));
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
          <h2 className="text-xl sm:text-2xl font-bold text-primary">
            {editCourse ? t("courses.addEdit.editCourse") : t("courses.addEdit.addCourse")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t("courses.addEdit.title")} 
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder={t("courses.addEdit.titlePlaceholder")}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t("courses.addEdit.description")}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
              placeholder={t("courses.addEdit.descriptionPlaceholder")}
            />
          </div>

          {/* Language Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t("courses.addEdit.learningLanguage")} 
              </label>
              <select
                required
                value={formData.languageCode}
                onChange={(e) => {
                  const selected = languageOptions.find(l => l.code === e.target.value);
                  setFormData({ 
                    ...formData, 
                    languageCode: e.target.value,
                    emoji: selected?.flag || "🌍"
                  });
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{t("courses.addEdit.selectLanguage")}</option>
                {languageOptions.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t("courses.addEdit.forSpeakersOf")} 
              </label>
              <select
                required
                value={formData.forSpeakersOf}
                onChange={(e) => setFormData({ ...formData, forSpeakersOf: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {languageOptions.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t("courses.addEdit.level.level")}
            </label>
            <div className="flex gap-4">
              {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((level) => (
                <label key={level} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="level"
                    value={level}
                    checked={formData.level === level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as "BEGINNER" | "INTERMEDIATE" | "ADVANCED" })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {level.charAt(0) + level.slice(1).toLowerCase()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Emoji */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t("courses.addEdit.emoji")}
            </label>
            <input
              type="text"
              value={formData.emoji}
              onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="🌍"
              maxLength={2}
            />
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
              {t("courses.addEdit.published")}
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (editCourse ? t("common.saving") : t("common.creating")) : (editCourse ? t("common.save") : t("common.create"))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
