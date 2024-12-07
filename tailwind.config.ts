import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        inter: ['Inter', 'Arial', 'sans-serif'],
      },
      fontSize: {
        '7': '1.75rem',      // 28px
        '7.375': '1.84375rem', // 29.5px
        '8.125': '2.03125rem', // 32.5px
      },
      spacing: {
        '4.5': '1.125rem',   // 18px
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        'primary-title': '#2D3648',
        primary: {
          DEFAULT: "#10B981",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#6B7280",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F3F4F6",
          foreground: "#6B7280",
        },
        accent: {
          DEFAULT: "#F9FAFB",
          foreground: "#111827",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#111827",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;