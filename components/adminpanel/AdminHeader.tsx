"use client";

import { Users, Shield } from "lucide-react";
import { useTranslation } from "@/app/i18n/I18nProvider";

type Tab = "users" | "admin";
type AdminHeaderProps = {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
};

export default function AdminHeader({ activeTab, onTabChange }: AdminHeaderProps) {
    const { t } = useTranslation();

    return (
        <div className="bg-card bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl border border-white/20 dark:border-gray-800/50 p-4 sm:p-6 mb-6 sm:mb-8">
            <h1 className="text-color text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">
                {t("adminPanel.title")}
            </h1>

            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <button
                    onClick={() => onTabChange("users")}
                    className={`flex cursor-pointer items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 ${activeTab === "users"
                        ? "bg-linear-to-r cl-decor text-white shadow-lg scale-105"
                        : "bg-gray-200/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-[#600000]/20 dark:hover:bg-[#600000]/20"
                        }`}
                >
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t("adminPanel.usersTab")}
                </button>

                <button
                    onClick={() => onTabChange("admin")}
                    className={`flex cursor-pointer items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 ${activeTab === "admin"
                        ? "bg-linear-to-r cl-decor text-white shadow-lg scale-105"
                        : "bg-gray-200/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-[#600000]/20 dark:hover:bg-[#600000]/20"
                        }`}
                >
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t("adminPanel.adminTab")}
                </button>
            </div>
        </div>
    );
}