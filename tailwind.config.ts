import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-open-sans)"],
                mono: ["var(--font-courier-prime)"],
            },
            colors: {
                teal: {
                    500: '#457b9d',
                    600: '#3a6b8a',
                },
            },
        },
    },
    plugins: [],
};

export default config;