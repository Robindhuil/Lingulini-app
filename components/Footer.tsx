"use client";
import Link from "next/link";
import { Heart, Mail, Globe } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-footer border-t border-gray-200 dark:border-gray-700 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="text-4xl">🌍</span>
                            <span className="text-2xl font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Lingulini
                            </span>
                        </div>
                        <p className="text-muted mb-4 max-w-md">
                            Making language learning fun and accessible for children worldwide. Join thousands of young learners on an exciting journey! 🚀
                        </p>
                        <div className="flex items-center space-x-4">
                            <a href="mailto:hello@lingulini.com" className="p-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors">
                                <Mail size={20} className="text-primary" />
                            </a>
                            <a href="#" className="p-2 bg-secondary/10 rounded-full hover:bg-secondary/20 transition-colors">
                                <Globe size={20} className="text-secondary" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-primary mb-4">Learn</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/learn" className="text-muted hover:text-primary transition-colors">
                                    Start Learning
                                </Link>
                            </li>
                            <li>
                                <Link href="/languages" className="text-muted hover:text-primary transition-colors">
                                    Languages
                                </Link>
                            </li>
                            <li>
                                <Link href="/games" className="text-muted hover:text-primary transition-colors">
                                    Games
                                </Link>
                            </li>
                            <li>
                                <Link href="/stories" className="text-muted hover:text-primary transition-colors">
                                    Stories
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-lg font-bold text-primary mb-4">Support</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/help" className="text-muted hover:text-primary transition-colors">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="/parents" className="text-muted hover:text-primary transition-colors">
                                    For Parents
                                </Link>
                            </li>
                            <li>
                                <Link href="/safety" className="text-muted hover:text-primary transition-colors">
                                    Child Safety
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-muted hover:text-primary transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-sm text-muted flex items-center space-x-1">
                        <span>Made with</span>
                        <Heart size={16} className="text-error fill-error" />
                        <span>for young learners • © {currentYear} Lingulini</span>
                    </p>
                    <div className="flex items-center space-x-6 text-sm">
                        <Link href="/privacy" className="text-muted hover:text-primary transition-colors">
                            Privacy
                        </Link>
                        <Link href="/terms" className="text-muted hover:text-primary transition-colors">
                            Terms
                        </Link>
                        <Link href="/cookies" className="text-muted hover:text-primary transition-colors">
                            Cookies
                        </Link>
                    </div>
                </div>

                {/* Fun Element */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-muted italic">
                        🎨 "The limits of my language are the limits of my world" - Ludwig Wittgenstein
                    </p>
                </div>
            </div>
        </footer>
    );
}
