import { useTranslation } from "@/app/i18n/I18nProvider";

export default function AdminSection() {
    const { t } = useTranslation();

    return (
        <div className="text-center px-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#600000] dark:text-[#600000] mb-3 sm:mb-4">
                {t("adminPanel.adminTab")}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {t("adminPanel.adminSection")}
            </p>
        </div>
    );
}