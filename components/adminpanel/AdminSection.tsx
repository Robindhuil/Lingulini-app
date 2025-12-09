import { useTranslation } from "@/app/i18n/I18nProvider";

export default function AdminSection() {
    const { t } = useTranslation();

    return (
        <div className="text-center">
            <h2 className="text-4xl font-bold text-[#600000] dark:text-[#600000] mb-4">
                {t("adminPanel.adminTab")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
                {t("adminPanel.adminSection")}
            </p>
        </div>
    );
}