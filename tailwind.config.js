/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        ink: {
          50: "#f3f6f6",
          100: "#e0e9e8",
          200: "#bdd3d1",
          300: "#8eb4b1",
          400: "#5d8d89",
          500: "#3d706c",
          600: "#2d5956",
          700: "#264947",
          800: "#0f3b3a",
          900: "#0a2a29",
          950: "#051716",
        },
        bronze: {
          50: "#faf7ef",
          100: "#f3ebd5",
          200: "#e6d4a8",
          300: "#d9bc75",
          400: "#c9a962",
          500: "#b88f4a",
          600: "#a3753f",
          700: "#875836",
          800: "#6f4831",
          900: "#5c3c2b",
        },
        vermilion: {
          50: "#fef3f2",
          100: "#fee4e2",
          200: "#ffcdc9",
          300: "#fdaaa4",
          400: "#f97870",
          500: "#ef4b41",
          600: "#dc2620",
          700: "#b91c1c",
          800: "#9a1b18",
          900: "#7f1c1a",
        },
        parchment: {
          50: "#fdfcfa",
          100: "#faf8f5",
          200: "#f3efe6",
          300: "#e9e1d1",
          400: "#d9cbb0",
        },
      },
      fontFamily: {
        serif: [
          "Noto Serif SC",
          "Source Han Serif SC",
          "Songti SC",
          "serif",
        ],
        sans: [
          "Noto Sans SC",
          "Source Han Sans SC",
          "PingFang SC",
          "sans-serif",
        ],
      },
      boxShadow: {
        "soft": "0 2px 12px -2px rgba(15, 59, 58, 0.08), 0 1px 4px -1px rgba(15, 59, 58, 0.04)",
        "card": "0 4px 24px -4px rgba(15, 59, 58, 0.1), 0 2px 8px -2px rgba(15, 59, 58, 0.06)",
        "bronze-glow": "0 0 20px rgba(201, 169, 98, 0.25)",
      },
      animation: {
        "pulse-soft": "pulse-soft 2.5s ease-in-out infinite",
        "fade-up": "fade-up 0.5s ease-out both",
        "fade-in": "fade-in 0.4s ease-out both",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
  },
  plugins: [],
};
