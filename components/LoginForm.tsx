"use client";
import { useState, useEffect } from "react";
import { LogIn, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useTranslation } from "@/app/i18n/I18nProvider";
import { useTheme } from "@/app/theme/ThemeProvider";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function LoginForm() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                {/* krátky placeholder/loader počas overovania session */}
            </div>
        );
    }
    if (status === "authenticated") {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!username.trim() || password.length < 6) {
            setError(t("login.validationError"));
            setIsLoading(false);
            return;
        }

        const result = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError(t("login.serverError"));
            setIsLoading(false);
        } else {
            router.push("/");
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-light dark:bg-gradient-dark">
            <div className="w-full max-w-md px-4 sm:px-6 lg:px-8">
                <div className="bg-card backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-linear-to-r cl-decor rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-color text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {t("login.title")}
                        </h2>
                        <p className="text-color text-gray-600 dark:text-gray-300">{t("login.subtitle")}</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-[#600000]/10 dark:bg-[#600000]/10 border border-[#600000]/50 dark:border-[#600000]/50 rounded-lg flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-[#600000]" />
                            <span className="text-sm text-[#600000]">{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="text-color block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t("login.username")}
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-[#600000] focus:border-[#600000] bg-white/50 dark:bg-gray-900/50 focus:ring-2"
                                placeholder={t("login.usernamePlaceholder")}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="text-color block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t("login.password")}
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-[#600000] focus:border-[#600000] bg-white/50 dark:bg-gray-900/50 focus:ring-2"
                                    placeholder={t("login.passwordPlaceholder")}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 px-4 bg-linear-to-r cl-decor cursor-pointer text-white rounded-lg hover:from-[#4b0000] hover:to-[#600000] transition-all duration-300"
                        >
                            {isLoading ? t("login.signingIn") : t("login.signIn")}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}