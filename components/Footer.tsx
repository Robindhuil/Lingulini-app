"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useTranslation } from "@/app/i18n/I18nProvider";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const {t} = useTranslation();

    return (
        <footer className="bg-footer border-t border-gray-200 dark:border-gray-700 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="text-4xl">🌍</span>
                            <span className="text-2xl font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                                {t("common.appName")}
                            </span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-primary mb-4">{t("footer.learn")}</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-muted hover:text-primary transition-colors">
                                    {t("footer.languages")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-lg font-bold text-primary mb-4">Support</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/contact" className="text-muted hover:text-primary transition-colors">
                                    {t("footer.contactUs")}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-xs sm:text-sm text-muted flex items-center space-x-1 text-center">
                        <span>Made with</span>
                        <Heart size={16} className="text-error fill-error" />
                        <span>for young learners • © {currentYear} Lingulini</span>
                    </p>
                </div>

                {/* Fun Element */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-muted italic">
                        🎨 &ldquo;The limits of my language are the limits of my world&rdquo; - Ludwig Wittgenstein
                    </p>
                </div>
            </div>
        </footer>
    );
}
