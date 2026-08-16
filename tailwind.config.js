/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#C41E3A",
          soft: "#E85A71",
        },
        apple: {
          light: "#F5F5F7",
          grouped: "#FFFFFF",
          ink: "#1D1D1F",
          mute: "#6E6E73",
          dark: "#000000",
          panel: "#1C1C1E",
          line: "#F5F5F7",
          dim: "#98989D",
        },
      },
      fontFamily: {
        sans: ["Manrope", "Noto Sans Arabic", "system-ui", "sans-serif"],
        display: ["Manrope", "Noto Sans Arabic", "system-ui", "sans-serif"],
        ar: ["Noto Sans Arabic", "Manrope", "sans-serif"],
      },
      borderRadius: {
        card: "24px",
        pill: "12px",
      },
      boxShadow: {
        subtle:
          "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
        medium:
          "0 4px 12px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.08)",
        prominent:
          "0 8px 24px rgba(0,0,0,0.12), 0 32px 64px rgba(0,0,0,0.16)",
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [],
};
