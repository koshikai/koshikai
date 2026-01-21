import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                "pastel-pink": "#ffd1dc",
                "pastel-blue": "#c1e1ec",
                "pastel-green": "#dcfce7",
                "pastel-yellow": "#fdfd96",
                "pastel-purple": "#e0d7ff",
                "gray-bg": "#1a1625",
            },
            fontFamily: {
                sans: ["var(--font-m-plus-rounded)", "M PLUS Rounded 1c", "sans-serif"],
            },
        },
    },
    plugins: [],
};
export default config;
