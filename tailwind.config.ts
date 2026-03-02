import type { Config } from "tailwindcss"
import tailwindcssAnimate from "tailwindcss-animate"
import typography from "@tailwindcss/typography"
import containerQueries from "@tailwindcss/container-queries"

const config: Config = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Container queries (ensure generated when passed as props)
    "@container",
    "px-4",
    "@sm:px-6",
    "@md:px-8",
    "@lg:px-12",
    "py-8",
    "@sm:py-12",
    "@md:py-16",
    "@lg:py-24",
    // React Live examples - ensure these classes are always generated
    "flex",
    "flex-col",
    "items-center",
    "gap-2",
    "gap-4",
    "text-lg",
    "font-semibold",
    "p-4",
    "rounded",
    "border",
    "bg-background",
    "text-foreground",
    "bg-muted",
    "text-muted-foreground",
    "bg-primary",
    "text-primary-foreground",
    "bg-destructive",
    "text-destructive-foreground",
    "bg-accent",
    "bg-accent/50",
    "text-accent-foreground",
    "hover:bg-accent",
    "hover:text-accent-foreground",
    "outline",
    "variant-outline",
    "variant-destructive",
    "variant-default",
    // Gradient colors
    "from-accent-brand",
    "to-amex-brand",
  ],
  theme: {
    extend: {
      // Container query breakpoints (match viewport sm/md/lg for consistent steps)
      containers: {
        sm: "40rem", // 640px
        md: "48rem", // 768px
        lg: "64rem", // 1024px
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)", // ease-in-out
      },
      fontFamily: {
        sans: ["var(--font-sora)", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)", // Slightly smaller for medium elements
        sm: "calc(var(--radius) - 4px)", // Smaller for compact elements
        "app-radius": "var(--app-radius)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--foreground))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--muted))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--status-text))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--status-text))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--status-text))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--border))",
        "input-placeholder": "hsl(var(--input-placeholder))",
        ring: "hsl(var(--ring))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-bg))",
          foreground: "hsl(var(--foreground))",
          primary: "hsl(var(--foreground))",
          "primary-foreground": "hsl(var(--primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--foreground))",
          border: "hsl(var(--border))",
          ring: "hsl(var(--ring))",
        },
        "call-action": "hsl(var(--call-action))",
        "accent-brand": "hsl(var(--accent-brand))",
        "accent-pink": "hsl(var(--accent-brand))", // Legacy alias
        "amex-brand": "hsl(var(--amex-brand))",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "collapsible-down": {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-out",
        "collapsible-up": "collapsible-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate, typography, containerQueries],
}

export default config
