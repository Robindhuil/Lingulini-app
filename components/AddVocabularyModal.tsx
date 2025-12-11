"use client";

import { useState, useEffect } from "react";
import { createVocabulary, updateVocabulary } from "@/app/actions/vocabulary";
import { X } from "lucide-react";
import { useTranslation } from "@/app/i18n/I18nProvider";

interface Vocabulary {
  id: number;
  chapterId: number;
  word: string;
  translation: string;
  pronunciation: string | null;
  example: string | null;
  exampleTranslation: string | null;
  type: string;
  audioUrl: string | null;
  imageUrl: string | null;
  order: number;
}

interface AddVocabularyModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterId: number;
  chapterName: string;
  editVocabulary?: Vocabulary | null;
}

export default function AddVocabularyModal({ 
  isOpen, 
  onClose, 
  chapterId, 
  chapterName,
  editVocabulary = null
}: AddVocabularyModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {t} = useTranslation();
  
  const [formData, setFormData] = useState({
    word: "",
    translation: "",
    pronunciation: "",
    example: "",
    exampleTranslation: "",
    type: "WORD" as "WORD" | "PHRASE" | "SENTENCE",
    audioUrl: "",
    imageUrl: "",
  });

  // Populate form when editing
  useEffect(() => {
    if (editVocabulary) {
      setFormData({
        word: editVocabulary.word,
        translation: editVocabulary.translation,
        pronunciation: editVocabulary.pronunciation || "",
        example: editVocabulary.example || "",
        exampleTranslation: editVocabulary.exampleTranslation || "",
        type: editVocabulary.type as "WORD" | "PHRASE" | "SENTENCE",
        audioUrl: editVocabulary.audioUrl || "",
        imageUrl: editVocabulary.imageUrl || "",
      });
    } else {
      setFormData({
        word: "",
        translation: "",
        pronunciation: "",
        example: "",
        exampleTranslation: "",
        type: "WORD",
        audioUrl: "",
        imageUrl: "",
      });
    }
  }, [editVocabulary, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = editVocabulary
        ? await updateVocabulary(editVocabulary.id, formData)
        : await createVocabulary({
            chapterId,
            ...formData,
          });
      
      if (result.success) {
        onClose();
      } else {
        setError(result.error || `Failed to ${editVocabulary ? 'update' : 'create'} vocabulary`);
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
      <div className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary">
              {editVocabulary ? t("vocabulary.addEdit.editVocabulary") : t("vocabulary.addEdit.addVocabulary")}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              for {chapterName}
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
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t("vocabulary.addEdit.type")}
            </label>
            <div className="flex gap-4">
              {["WORD", "PHRASE", "SENTENCE"].map((type) => (
                <label key={type} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={formData.type === type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as "WORD" | "PHRASE" | "SENTENCE" })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Word/Phrase/Sentence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {formData.type === "WORD" ? t("vocabulary.addEdit.word") : formData.type === "PHRASE" ? t("vocabulary.addEdit.phrase") : t("vocabulary.addEdit.sentence")} (Slovak) *
              </label>
              <input
                type="text"
                required
                value={formData.word}
                onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={formData.type === "WORD" ? t("vocabulary.addEdit.wordPlaceholder") : formData.type === "PHRASE" ? t("vocabulary.addEdit.phrasePlaceholder") : t("vocabulary.addEdit.sentencePlaceholder")}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t("vocabulary.addEdit.translation")} 
              </label>
              <input
                type="text"
                required
                value={formData.translation}
                onChange={(e) => setFormData({ ...formData, translation: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={formData.type === "WORD" ? t("vocabulary.addEdit.wordTranslationPlaceholder") : formData.type === "PHRASE" ? t("vocabulary.addEdit.phraseTranslationPlaceholder") : t("vocabulary.addEdit.sentenceTranslationPlaceholder")}
              />
            </div>
          </div>

          {/* Pronunciation */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t("vocabulary.addEdit.pronunciation")}
            </label>
            <input
              type="text"
              value={formData.pronunciation}
              onChange={(e) => setFormData({ ...formData, pronunciation: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder={t("vocabulary.addEdit.pronunciationPlaceholder")}
            />
          </div>

          {/* Example & Translation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t("vocabulary.addEdit.exampleSentence")} 
              </label>
              <textarea
                value={formData.example}
                onChange={(e) => setFormData({ ...formData, example: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={2}
                placeholder={t("vocabulary.addEdit.exampleSentencePlaceholder")}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t("vocabulary.addEdit.exampleTranslatedSentence")}
              </label>
              <textarea
                value={formData.exampleTranslation}
                onChange={(e) => setFormData({ ...formData, exampleTranslation: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={2}
                placeholder={t("vocabulary.addEdit.exampleTranslatedSentencePlaceholder")}
              />
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Audio URL (Optional)
              </label>
              <input
                type="url"
                value={formData.audioUrl}
                onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://..."
              />
            </div> */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t("vocabulary.addEdit.image")}
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={t("vocabulary.addEdit.imagePlaceholder")}
              />
            </div>
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
              {loading ? (editVocabulary ? t("common.saving") : t("common.creating")) : (editVocabulary ? t("vocabulary.admin.editVocabulary") : t("vocabulary.admin.addVocabulary"))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
