"use client";
import { useState, useEffect } from "react";
import { Mail, Eye, EyeOff, AlertCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function LoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-bounce-subtle text-6xl">🌍</div>
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

        if (!email.trim() || !email.includes("@")) {
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setIsLoading(false);
            return;
        }

        const result = await signIn("credentials", {
            redirect: false,
            email: email,
            password: password,
        });

        if (result?.error) {
            setError("Invalid email or password. Please try again!");
            setIsLoading(false);
        } else {
            router.push("/");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
            {/* Playful Background Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full animate-float"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-secondary rounded-full animate-bounce-subtle"></div>
                <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-accent rounded-full animate-float" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-40 right-1/4 w-28 h-28 bg-primary rounded-full animate-bounce-subtle" style={{animationDelay: '2s'}}></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="card-playful p-6 sm:p-8 md:p-10">
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 animate-bounce-subtle">🌍</div>
                        <h1 className="text-3xl sm:text-4xl font-black mb-2 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Welcome Back!
                        </h1>
                        <p className="text-sm sm:text-base text-muted">Log in to continue your language adventure</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-error/10 border-2 border-error rounded-2xl flex items-start space-x-3">
                            <AlertCircle className="text-error shrink-0 mt-0.5" size={20} />
                            <p className="text-sm text-error font-semibold">{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-primary mb-2">
                                📧 Email Address
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 pl-12 bg-card border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-primary"
                                    placeholder="your@email.com"
                                    required
                                    disabled={isLoading}
                                />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-xs sm:text-sm font-bold text-primary mb-2">
                                🔒 Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 pr-12 bg-card border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-primary"
                                    placeholder="••••••••"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-3 sm:py-4 text-base sm:text-lg font-black flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    <span>Logging In...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    <span>Start Learning!</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted">
                            Don&apos;t have an account?{" "}
                            <button className="text-primary font-bold hover:text-secondary transition-colors">
                                Sign Up Free
                            </button>
                        </p>
                    </div>
                </div>

                {/* Fun Tip */}
                <div className="mt-6 p-4 bg-accent/10 rounded-2xl text-center">
                    <p className="text-sm font-semibold text-accent">
                        💡 Tip: Practice for just 10 minutes daily to see amazing progress!
                    </p>
                </div>
            </div>
        </div>
    );
}
