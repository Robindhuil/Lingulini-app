"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import sk from "../locales/sk.json";
import en from "../locales/en.json";
import de from "../locales/de.json";
import nl from "../locales/nl.json";

type Locale = "sk" | "en" | "de" | "nl";
const translations: Record<Locale, Record<string, unknown>> = { sk, en, de, nl };

type I18nContextType = {
    locale: Locale;
    setLocale: (l: Locale) => void;
    t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType>({
    locale: "sk",
    setLocale: () => { },
    t: (k) => k,
});

export function I18nProvider({ children, initial = "sk" as Locale }: { children: React.ReactNode; initial?: Locale }) {
    const [locale, setLocale] = useState<Locale>(() => {
        if (typeof window !== "undefined") {
            const stored = (localStorage.getItem("locale") as Locale) || undefined;
            return stored ?? initial;
        }
        return initial;
    });

    useEffect(() => {
        localStorage.setItem("locale", locale);
        // update html lang attr
        if (typeof document !== "undefined") {
            document.documentElement.lang = locale === "en" ? "en" : locale;
        }
    }, [locale]);

    const t = useMemo(
        () => (key: string) => {
            const keys = key.split(".");
            let v: unknown = translations[locale];
            for (const k of keys) {
                if (v == null) return key;
                v = (v as Record<string, unknown>)[k];
            }
            return typeof v === "string" ? v : key;
        },
        [locale]
    );

    return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export const useTranslation = () => useContext(I18nContext);
