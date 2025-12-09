"use client";
import Link from "next/link";
import { Mail, Github, Twitter, Linkedin } from "lucide-react";
import { useTranslation } from "@/app/i18n/I18nProvider";

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="bg-linear-to-r from-[#f8f8f8]/95 to-white/95 bg-navbar text-gray-700 dark:text-gray-200 border-t border-gray-200/50 dark:border-gray-800/50">
            <div className="w-full px-2 sm:px-4 lg:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex-1">
                        <Link href="/" className="text-2xl font-bold text-[#600000] hover:text-[#4b0000] transition-colors duration-300">
                            MyApp
                        </Link>
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs leading-relaxed">
                            {t("footer.getUpdates")}
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                            <a
                                href="#newsletter"
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-200/80 dark:bg-gray-800/80 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-[#600000]/20 dark:hover:bg-[#600000]/20 transition-all duration-300"
                                aria-label={t("footer.newsletter")}
                            >
                                <Mail className="w-4 h-4" />
                                {t("footer.newsletter")}
                            </a>
                            <a href="https://github.com" aria-label="GitHub" className="p-2 rounded-full bg-gray-200/80 dark:bg-gray-800/80 hover:bg-[#600000]/20 dark:hover:bg-[#600000]/20 transition-all duration-300">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="https://twitter.com" aria-label="Twitter" className="p-2 rounded-full bg-gray-200/80 dark:bg-gray-800/80 hover:bg-[#600000]/20 dark:hover:bg-[#600000]/20 transition-all duration-300">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="https://linkedin.com" aria-label="LinkedIn" className="p-2 rounded-full bg-gray-200/80 dark:bg-gray-800/80 hover:bg-[#600000]/20 dark:hover:bg-[#600000]/20 transition-all duration-300">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/features" className="text-gray-600 dark:text-gray-400 hover:text-[#600000] dark:hover:text-[#600000] transition-colors duration-300">Features</Link></li>
                                <li><Link href="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-[#600000] dark:hover:text-[#600000] transition-colors duration-300">Pricing</Link></li>
                                <li><Link href="/docs" className="text-gray-600 dark:text-gray-400 hover:text-[#600000] dark:hover:text-[#600000] transition-colors duration-300">Docs</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-[#600000] dark:hover:text-[#600000] transition-colors duration-300">About</Link></li>
                                <li><Link href="/careers" className="text-gray-600 dark:text-gray-400 hover:text-[#600000] dark:hover:text-[#600000] transition-colors duration-300">Careers</Link></li>
                                <li><Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-[#600000] dark:hover:text-[#600000] transition-colors duration-300">Blog</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Support</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/help" className="text-gray-600 dark:text-gray-400 hover:text-[#600000] dark:hover:text-[#600000] transition-colors duration-300">Help Center</Link></li>
                                <li><Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-[#600000] dark:hover:text-[#600000] transition-colors duration-300">Contact</Link></li>
                                <li><Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-[#600000] dark:hover:text-[#600000] transition-colors duration-300">Privacy</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Get Updates</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-xs leading-relaxed">{t("footer.subscribeDesc")}</p>
                        <form
                            id="newsletter"
                            className="flex items-center gap-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                alert("Ďakujeme! (demo)");
                            }}
                        >
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                placeholder="tvoj@email.sk"
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white/80 dark:bg-gray-900/80 text-sm text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-[#600000] transition-all duration-300"
                            />
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-linear-to-r from-[#600000] to-[#4b0000] text-white rounded-lg font-medium hover:scale-105 hover:shadow-xl transition-all duration-300"
                            >
                                {t("footer.subscribe")}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-10 border-t border-gray-200/50 dark:border-gray-800/50 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 dark:text-gray-400">
                    <p>© {new Date().getFullYear()} MyApp. {t("footer.rights")}</p>
                    <div className="mt-4 sm:mt-0 flex items-center gap-6">
                        <Link href="/terms" className="hover:text-[#600000] dark:hover:text-[#600000] transition-colors duration-300">{t("footer.terms")}</Link>
                        <Link href="/security" className="hover:text-[#600000] dark:hover:text-[#600000] transition-colors duration-300">{t("footer.security")}</Link>
                        <Link href="/contact" className="hover:text-[#600000] dark:hover:text-[#600000] transition-colors duration-300">{t("footer.contact")}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}