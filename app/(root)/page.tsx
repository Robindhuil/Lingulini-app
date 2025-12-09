"use client";
import { useTranslation } from "@/app/i18n/I18nProvider";
import { useTheme } from "@/app/theme/ThemeProvider";
import Image from "next/image";

export default function HomePage() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-light dark:bg-gradient-dark">
      <div className="relative w-full max-w-7xl px-2 sm:px-4 lg:px-6 text-center">
        <div className="mb-12">
          <Image
            src={theme === 'light' ? '/logos/light/full_logo.svg' : '/logos/dark/full_logo.svg'}
            alt="Full Logo"
            width={200}
            height={100}
            priority
            className="mx-auto w-auto h-auto transition-transform duration-500 hover:scale-105"
          />
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-[#600000] mb-6 tracking-tight">{t("home.title")}</h1>
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          {t("home.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="#get-started" className="px-8 py-4 bg-linear-to-r from-[#600000] to-[#4b0000] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            {t("home.getStarted")}
          </a>
          <a href="#learn-more" className="px-8 py-4 border border-[#600000] text-[#600000] dark:border-gray-600 dark:text-gray-300 rounded-lg font-semibold hover:bg-[#600000]/10 dark:hover:bg-[#600000]/20 hover:scale-105 transition-all duration-300">
            {t("home.learnMore")}
          </a>
        </div>
      </div>
    </section>
  );
}