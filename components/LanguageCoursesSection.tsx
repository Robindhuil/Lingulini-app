"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LanguageCard from "@/components/LanguageCard";
import AddCourseModal from "@/components/AddCourseModal";
import { Plus } from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string | null;
  languageCode: string;
  forSpeakersOf: string;
  level: string;
  emoji: string | null;
  isPublished: boolean;
  order: number;
}

interface LanguageCoursesSectionProps {
  courses: Course[];
  isAdmin: boolean;
}

// Map language codes to gradients
const getGradientForLanguage = (code: string): string => {
  const gradients: Record<string, string> = {
    sk: "from-blue-400 to-blue-600",
    en: "from-red-400 to-red-600",
    es: "from-orange-400 to-red-600",
    fr: "from-indigo-400 to-indigo-600",
    de: "from-yellow-400 to-yellow-600",
    it: "from-green-400 to-green-600",
    pt: "from-orange-400 to-orange-600",
    ja: "from-pink-400 to-pink-600",
    zh: "from-red-400 to-yellow-600",
    ko: "from-blue-400 to-pink-600",
    ru: "from-blue-400 to-red-600",
    ar: "from-green-400 to-yellow-600",
    hi: "from-orange-400 to-pink-600",
  };
  return gradients[code] || "from-purple-400 to-purple-600";
};

export default function LanguageCoursesSection({ courses, isAdmin }: LanguageCoursesSectionProps) {
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLang(langCode);
    // Navigate to packs page for this language
    router.push(`/packs/${langCode}`);
  };

  return (
    <>
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-primary">
          Choose Your Language Adventure! 🗣️
        </h2>
        <p className="text-center text-lg text-secondary mb-12">
          Pick a language you want to learn and start your journey
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <LanguageCard
              key={course.id}
              code={course.languageCode}
              name={course.title}
              nativeName={course.description || course.title}
              flag={course.emoji || "🌍"}
              gradient={getGradientForLanguage(course.languageCode)}
              isSelected={selectedLang === course.languageCode}
              onSelect={handleLanguageSelect}
            />
          ))}

          {/* Add Course Button - Only for Admins */}
          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="card-playful text-center p-8 cursor-pointer border-4 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <div className="text-6xl mb-4">
                <Plus className="w-16 h-16 mx-auto text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400">
                Add New Course
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Create a new language course
              </p>
            </button>
          )}
        </div>
      </section>

      {/* Add Course Modal */}
      <AddCourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
