/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand
        forest: "#0F3D2E",
        "forest-light": "#1A5C44",
        emerald: {
          DEFAULT: "#10B981",
          hover: "#059669",
        },

        // Light mode surfaces
        "warm-white": "#FAFAF9",
        surface: "#FFFFFF",
        "surface-2": "#F5F4F2",

        // Dark mode surfaces
        ink: "#0E0E10",
        "ink-surface": "#161618",
        "ink-surface-2": "#1E1E22",

        // Text scale
        "text-primary": "#1A1A1A",
        "text-secondary": "#6B7280",
        "text-tertiary": "#9CA3AF",
        "text-dim": "#D1D5DB",

        // Borders
        "border-light": "#E5E7EB",
        "border-dark": "#2D2D35",

        // Risk system (semantic, keep existing)
        "risk-high": "#EF4444",
        "risk-medium": "#F59E0B",
        "risk-low": "#3B82F6",
        "risk-clear": "#10B981",

        // Legacy aliases (keeps old components from breaking immediately)
        primary: "#0F3D2E",
        "primary-hover": "#1A5C44",
        obsidian: "#0E0E10",
        "obsidian-light": "#161618",
        "surface-dark": "#1E1E22",
        "accent-green": "#10B981",
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        // Playfair removed — replaced by Inter 900 for display headlines
      },

      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.05)",
        "card-elevated": "0 8px 24px rgba(0,0,0,0.12)",
        "card-dark": "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)",
        "card-dark-hover": "0 4px 12px rgba(0,0,0,0.5)",
        // Legacy
        glow: "0 0 60px -15px rgba(16, 185, 129, 0.25)",
      },

      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "slide-up": "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },

      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },

      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },

      backgroundImage: {
        // Subtle warm noise texture alternative
        "hero-gradient": "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(16,185,129,0.08) 0%, transparent 70%)",
        "hero-gradient-dark": "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(15,61,46,0.4) 0%, transparent 70%)",
        // Legacy
        "lovable-glow": "conic-gradient(from 180deg at 50% 50%, #0F3D2E 0deg, #10B981 180deg, #0F3D2E 360deg)",
      },
    },
  },
  plugins: [],
}
