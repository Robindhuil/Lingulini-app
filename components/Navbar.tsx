"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut, Sun, Moon, Shield, Sparkles } from "lucide-react";
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
        <nav className="bg-navbar backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="text-4xl group-hover:scale-110 transition-transform">🌍</div>
                        <span className="text-2xl font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Lingulini
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-lg font-semibold text-primary hover:text-secondary transition-colors relative group">
                            Home
                            <span className="absolute bottom-0 left-0 w-0 h-1 bg-secondary group-hover:w-full transition-all duration-300 rounded-full"></span>
                        </Link>
                        
                        {session && (
                            <Link href="/learn" className="text-lg font-semibold text-primary hover:text-secondary transition-colors relative group">
                                Learn
                                <span className="absolute bottom-0 left-0 w-0 h-1 bg-secondary group-hover:w-full transition-all duration-300 rounded-full"></span>
                            </Link>
                        )}
                        
                        {admin && (
                            <Link href="/adminpanel" className="flex items-center space-x-1 text-lg font-semibold text-accent hover:text-accent-hover transition-colors">
                                <Shield size={18} />
                                <span>Admin</span>
                            </Link>
                        )}
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <LanguageSelector />
                        
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-card transition-colors" aria-label="Toggle theme">
                            {theme === "light" ? (
                                <Moon size={20} className="text-primary" />
                            ) : (
                                <Sun size={20} className="text-accent" />
                            )}
                        </button>

                        {session ? (
                            <div className="flex items-center space-x-3">
                                <span className="text-sm font-semibold text-primary">
                                    👋 {session.user?.name || session.user?.email}
                                </span>
                                <button onClick={handleSignOut} className="btn-secondary px-4 py-2 text-sm flex items-center space-x-2">
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <button onClick={handleLoginClick} className="btn-primary px-6 py-2 text-sm flex items-center space-x-2">
                                <Sparkles size={16} />
                                <span>Login</span>
                            </button>
                        )}
                    </div>

                    <div className="md:hidden flex items-center space-x-2">
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-card transition-colors">
                            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <button onClick={toggleMenu} className="p-2 rounded-lg hover:bg-card transition-colors">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-navbar border-t border-gray-200 dark:border-gray-700">
                    <div className="px-4 pt-4 pb-6 space-y-3">
                        <Link href="/" className="block px-4 py-3 rounded-xl text-lg font-semibold bg-card hover:bg-primary hover:text-white transition-all" onClick={toggleMenu}>
                            🏠 Home
                        </Link>
                        
                        {session && (
                            <Link href="/learn" className="block px-4 py-3 rounded-xl text-lg font-semibold bg-card hover:bg-primary hover:text-white transition-all" onClick={toggleMenu}>
                                📚 Learn
                            </Link>
                        )}
                        
                        {admin && (
                            <Link href="/adminpanel" className="block px-4 py-3 rounded-xl text-lg font-semibold bg-accent text-white hover:bg-accent-hover transition-all" onClick={toggleMenu}>
                                🛡️ Admin Panel
                            </Link>
                        )}

                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                            <LanguageSelector />
                        </div>

                        {session ? (
                            <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <div className="px-4 py-2 text-sm text-muted">
                                    👋 {session.user?.name || session.user?.email}
                                </div>
                                <button onClick={() => { handleSignOut(); toggleMenu(); }} className="w-full btn-secondary px-4 py-3 flex items-center justify-center space-x-2">
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => { handleLoginClick(); toggleMenu(); }} className="w-full btn-primary px-4 py-3 flex items-center justify-center space-x-2">
                                <Sparkles size={18} />
                                <span>Login</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
