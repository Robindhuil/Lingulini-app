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
        <div className="bg-card bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-800/50 p-6 mb-8">
            <h1 className="text-color text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                {t("adminPanel.title")}
            </h1>

            <div className="flex justify-center gap-4 flex-wrap">
                <button
                    onClick={() => onTabChange("users")}
                    className={`flex cursor-pointer items-center gap-2 px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300 ${activeTab === "users"
                        ? "bg-linear-to-r cl-decor text-white shadow-lg scale-105"
                        : "bg-gray-200/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-[#600000]/20 dark:hover:bg-[#600000]/20"
                        }`}
                >
                    <Users className="w-5 h-5" />
                    {t("adminPanel.usersTab")}
                </button>

                <button
                    onClick={() => onTabChange("admin")}
                    className={`flex cursor-pointer items-center gap-2 px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300 ${activeTab === "admin"
                        ? "bg-linear-to-r cl-decor text-white shadow-lg scale-105"
                        : "bg-gray-200/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-[#600000]/20 dark:hover:bg-[#600000]/20"
                        }`}
                >
                    <Shield className="w-5 h-5" />
                    {t("adminPanel.adminTab")}
                </button>
            </div>
        </div>
    );
}