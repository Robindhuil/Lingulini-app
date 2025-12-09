"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogIn, LogOut, Sun, Moon, Shield } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/app/i18n/I18nProvider";
import LanguageSelector from "./LanguageSelector";
import { useTheme } from "@/app/theme/ThemeProvider";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { isAdmin } from "@/utils/auth";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const { data: session } = useSession();
    const admin = isAdmin(session);
    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLoginClick = () => {
        router.push("/login");
    };

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push("/");
    };

    return (
        <nav className="bg-navbar backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-300 dark:border-gray-800">
            <div className="w-full px-2 sm:px-4 lg:px-6">
                <div className="flex items-center justify-between h-20 md:h-24">
                    {/* Logo - Very Left */}
                    <Link href="/" className="flex items-center pl-2 sm:pl-4">
                        <Image
                            src={theme === "light" ? "/logos/light/logo_name.svg" : "/logos/dark/logo_name.svg"}
                            alt="Logo"
                            width={220}
                            height={80}
                            priority
                            className="h-15 w-auto transition-transform duration-300 hover:scale-105"
                        />
                    </Link>

                    {/* Desktop Links - Centered */}
                    <div className="hidden md:flex flex-1 items-center justify-center space-x-12 text-xl font-semibold">
                        <Link href="/" className="relative group">
                            <span className="text-gray-800 dark:text-gray-200 group-hover:text-[#600000] dark:group-hover:text-[#600000] transition-colors duration-300">
                                {t("navbar.home")}
                            </span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#600000] group-hover:w-full transition-all duration-300 ease-out"></span>
                        </Link>
                        <Link href="/about" className="relative group">
                            <span className="text-gray-800 dark:text-gray-200 group-hover:text-[#600000] dark:group-hover:text-[#600000] transition-colors duration-300">
                                {t("navbar.about")}
                            </span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#600000] group-hover:w-full transition-all duration-300 ease-out"></span>
                        </Link>
                        <Link href="/contact" className="relative group">
                            <span className="text-gray-800 dark:text-gray-200 group-hover:text-[#600000] dark:group-hover:text-[#600000] transition-colors duration-300">
                                {t("navbar.contact")}
                            </span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#600000] group-hover:w-full transition-all duration-300 ease-out"></span>
                        </Link>
                        <Link href="/news" className="relative group">
                            <span className="text-gray-800 dark:text-gray-200 group-hover:text-[#600000] dark:group-hover:text-[#600000] transition-colors duration-300">
                                {t("navbar.news")}
                            </span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#600000] group-hover:w-full transition-all duration-300 ease-out"></span>
                        </Link>
                        <Link href="/gallery" className="relative group">
                            <span className="text-gray-800 dark:text-gray-200 group-hover:text-[#600000] dark:group-hover:text-[#600000] transition-colors duration-300">
                                {t("navbar.gallery")}
                            </span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#600000] group-hover:w-full transition-all duration-300 ease-out"></span>
                        </Link>
                    </div>

                    {/* Right Controls - Very Right */}
                    <div className="hidden md:flex items-center space-x-4 pr-2 sm:pr-4">
                        <LanguageSelector />
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="flex items-center justify-center w-12 h-12 cursor-pointer rounded-full bg-gray-200/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 hover:bg-[#600000]/20 dark:hover:bg-[#600000]/20 transition-all duration-300 hover:scale-110"
                        >
                            {theme === "light" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                        </button>
                        {session ? (
                            <>
                                {admin && (
                                    <Link
                                        href="/adminpanel"
                                        className="flex items-center space-x-2 bg-gray-100/60 dark:bg-gray-800/60 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg text-lg font-medium transition-all duration-200 hover:scale-105"
                                    >
                                        <Shield className="w-5 h-5" />
                                        <span>Admin</span>
                                    </Link>
                                )}
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center space-x-2 bg-linear-to-r cl-decor cursor-pointer text-white px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                >
                                    <LogOut className="w-6 h-6" />
                                    <span>{t("navbar.signOut")}</span>
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center space-x-2 bg-linear-to-r cl-decor cursor-pointer text-white px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            >
                                <LogIn className="w-6 h-6" />
                                <span>{t("navbar.login")}</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-800 dark:text-gray-200 hover:text-[#600000] dark:hover:text-[#600000] focus:outline-none transition-transform duration-300 ease-in-out transform hover:scale-110 pr-2 sm:pr-4"
                        onClick={toggleMenu}
                    >
                        {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden bg-linear-to-r from-[#f8f8f8]/95 to-white/95 bg-navbar backdrop-blur-md shadow-lg border-t border-gray-200/50 dark:border-gray-800/50 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96" : "max-h-0"
                    }`}
            >
                <div className="px-4 py-4 space-y-3">
                    {/* mobile admin link */}
                    {session && admin && (
                        <Link
                            href="/adminpanel"
                            className="block text-gray-800 dark:text-gray-200 hover:text-[#600000] dark:hover:text-[#600000] transition-all duration-300 hover:pl-2 text-lg font-semibold"
                            onClick={() => setIsOpen(false)}
                        >
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                <span>Admin</span>
                            </div>
                        </Link>
                    )}
                    <Link
                        href="/"
                        className="block text-gray-800 dark:text-gray-200 hover:text-[#600000] dark:hover:text-[#600000] transition-all duration-300 hover:pl-2 text-lg font-semibold"
                        onClick={() => setIsOpen(false)}
                    >
                        {t("navbar.home")}
                    </Link>
                    <Link
                        href="/about"
                        className="block text-gray-800 dark:text-gray-200 hover:text-[#600000] dark:hover:text-[#600000] transition-all duration-300 hover:pl-2 text-lg font-semibold"
                        onClick={() => setIsOpen(false)}
                    >
                        {t("navbar.about")}
                    </Link>
                    <Link
                        href="/contact"
                        className="block text-gray-800 dark:text-gray-200 hover:text-[#600000] dark:hover:text-[#600000] transition-all duration-300 hover:pl-2 text-lg font-semibold"
                        onClick={() => setIsOpen(false)}
                    >
                        {t("navbar.contact")}
                    </Link>
                    <Link
                        href="/news"
                        className="block text-gray-800 dark:text-gray-200 hover:text-[#600000] dark:hover:text-[#600000] transition-all duration-300 hover:pl-2 text-lg font-semibold"
                        onClick={() => setIsOpen(false)}
                    >
                        {t("navbar.news")}
                    </Link>
                    <Link
                        href="/gallery"
                        className="block text-gray-800 dark:text-gray-200 hover:text-[#600000] dark:hover:text-[#600000] transition-all duration-300 hover:pl-2 text-lg font-semibold"
                        onClick={() => setIsOpen(false)}
                    >
                        {t("navbar.gallery")}
                    </Link>
                    <div className="flex items-center gap-4 pt-2">
                        <LanguageSelector />
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 hover:bg-[#600000]/20 dark:hover:bg-[#600000]/20 transition-all duration-300 hover:scale-110"
                        >
                            {theme === "light" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                        </button>
                    </div>
                    {session ? (
                        <button
                            onClick={handleSignOut}
                            className="flex items-center space-x-2 w-full bg-linear-to-r from-[#600000] to-[#4b0000] text-white px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                            <LogOut className="w-6 h-6" />
                            <span>{t("navbar.signOut")}</span>
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="flex items-center space-x-2 w-full bg-linear-to-r from-[#600000] to-[#4b0000] text-white px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                            <LogIn className="w-6 h-6" />
                            <span>{t("navbar.login")}</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}