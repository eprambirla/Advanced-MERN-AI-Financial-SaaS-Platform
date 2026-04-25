/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        /* Base */
        background: "var(--background)",
        foreground: "var(--foreground)",

        /* Card */
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },

        /* Popover */
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },

        /* Primary */
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },

        /* Secondary */
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },

        /* Muted */
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },

        /* Accent */
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },

        /* States */
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },

        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
        },

        error: {
          DEFAULT: "var(--error)",
          foreground: "var(--error-foreground)",
        },

        warning: {
          DEFAULT: "var(--warning)",
          foreground: "var(--warning-foreground)",
        },

        /* Borders & Inputs */
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",

        /* Charts */
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
          income: "var(--chart-income)",
          expense: "var(--chart-expense)",
          savings: "var(--chart-savings)",
        },
      },

      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.05)",
        card: "0 6px 20px rgba(0,0,0,0.08)",
      },

      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};