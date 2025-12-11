"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "@/app/i18n/I18nProvider";

const languages = [
    { locale: "sk", flag: "sk", name: "Slovenčina" },
    { locale: "en", flag: "gb", name: "English" },
    { locale: "cz", flag: "cz", name: "Čeština" },
    { locale: "ua", flag: "ua", name: "Українська" },
];

export default function LanguageSelector() {
    const { locale, setLocale } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const selected = languages.find((l) => l.locale === locale) ?? languages[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex cursor-pointer items-center space-x-2 text-gray-800 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors duration-300"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                type="button"
            >
                <span className={`fi fi-${selected.flag} w-6 h-4 rounded-sm`} aria-hidden="true" />
                <span className="text-lg">{selected.locale.toUpperCase()}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 py-2 w-56 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl z-50" role="listbox">
                    {languages.map((lang) => (
                        <button
                            key={lang.locale}
                            onClick={() => {
                                setLocale(lang.locale as "sk" | "en" | "cz" | "ua");
                                setIsOpen(false);
                            }}
                            className="flex items-center space-x-3 w-full px-4 py-2 text-left text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors duration-200"
                            role="option"
                            aria-selected={locale === lang.locale}
                            type="button"
                        >
                            <span className={`fi fi-${lang.flag} w-6 h-4 rounded-sm`} aria-hidden="true" />
                            <span>{lang.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
