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
        '3.25': '0.8125rem',    // 13px
        '3.375': '0.84375rem',  // 13.5px
        '3.625': '0.90625rem',  // 14.5px
        '5.25': '1.3125rem',    // 21px
        '5.5': '1.375rem',      // 22px
        '5.75': '1.4375rem',    // 23px
        '7': '1.75rem',         // 28px
        '7.375': '1.84375rem',  // 29.5px
        '8.125': '2.03125rem',  // 32.5px
      },
      spacing: {
        '0.5px': '0.5px',
        '1.625': '0.40625rem',  // 6.5px
        '1.75': '0.4375rem',    // 7px
        '2.25': '0.5625rem',    // 9px
        '4.5': '1.125rem',      // 18px
        '7.5': '1.875rem',      // 30px
        '8': '2rem',            // 32px
        '9': '2.25rem',         // 36px
      },
      borderRadius: {
        '1.25': '0.3125rem',    // 5px
        '1.375': '0.34375rem',  // 5.5px
        '2.25': '0.5625rem',    // 9px
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      lineHeight: {
        '4': '1rem',            // 16px
        '6': '1.5rem',          // 24px
        '6.5': '1.625rem',      // 26px
      },
      letterSpacing: {
        's-tight': '-0.01em',
      },
      boxShadow: {
        'cw-second': '0 2px 8px rgba(0, 0, 0, 0.08)',
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
        'neutral-525': '#666666',
        'neutral-200': '#CCCCCC',
      },
      strokeWidth: {
        '3': '3',
        '3.25': '3.25',
        '3.5': '3.5',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
