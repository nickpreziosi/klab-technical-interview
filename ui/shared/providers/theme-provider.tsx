"use client"

import * as React from "react"
import { useIsPageThemeActive } from "@/ui/shared/components/page-theme-setter"

export type Theme = "light" | "dark" | "system"

/** Effective theme used when rendering (resolves "system" to actual light/dark) */
export type ResolvedTheme = "light" | "dark"

export interface ThemeProviderProps {
  children: React.ReactNode
  /** Default theme used when no saved preference exists */
  defaultTheme?: Theme
  /** Key used for localStorage persistence */
  storageKey?: string
  /** Initial theme from database/API (takes precedence over localStorage) */
  initialTheme?: Theme
  /** Callback fired when theme changes - use for database persistence */
  onThemeChange?: (theme: Theme) => Promise<void> | void
  /** Whether to persist to localStorage (default: true) */
  persistToStorage?: boolean
}

interface ThemeProviderContextValue {
  theme: Theme
  /** Resolved effective theme; when theme is "system", this reflects the actual light/dark state */
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  mounted: boolean
}

// Use a global symbol to ensure context is shared across npm package and consuming app bundles
// This prevents the "duplicate context" issue where provider and consumer have different context objects
const THEME_CONTEXT_KEY = Symbol.for("k-lab-components-theme-context")

function getThemeContext(): React.Context<ThemeProviderContextValue | undefined> {
  const globalObj = typeof globalThis !== "undefined" ? globalThis : window

  if (!(globalObj as Record<symbol, unknown>)[THEME_CONTEXT_KEY]) {
    ;(globalObj as Record<symbol, unknown>)[THEME_CONTEXT_KEY] = React.createContext<
      ThemeProviderContextValue | undefined
    >(undefined)
  }

  return (globalObj as Record<symbol, unknown>)[THEME_CONTEXT_KEY] as React.Context<
    ThemeProviderContextValue | undefined
  >
}

const ThemeProviderContext = getThemeContext()

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "k-lab-components-theme",
  initialTheme,
  onThemeChange,
  persistToStorage = true,
}: ThemeProviderProps) {
  // Always start with default on both server and client to avoid hydration mismatch
  const [theme, setThemeState] = React.useState<Theme>(initialTheme || defaultTheme)
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>("light")
  const [mounted, setMounted] = React.useState(false)
  const previousThemeRef = React.useRef<Theme | null>(null)
  const isPageThemeActive = useIsPageThemeActive()

  const getResolvedTheme = React.useCallback((): ResolvedTheme => {
    if (theme === "system") {
      return typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    }
    return theme
  }, [theme])

  // Apply theme immediately on mount using useLayoutEffect (runs before paint)
  // This allows PageThemeSetter to set data attribute first, preventing flash
  React.useLayoutEffect(() => {
    const root = document.documentElement

    // Check if PageThemeSetter is active - if so, skip applying theme
    if (root.hasAttribute("data-page-theme-active")) {
      setMounted(true)
      // Still load from localStorage for state, but don't apply to DOM
      if (persistToStorage && !initialTheme) {
        try {
          const stored = localStorage.getItem(storageKey) as Theme | null
          if (stored && (stored === "light" || stored === "dark" || stored === "system")) {
            setThemeState(stored)
          }
        } catch {
          // Ignore localStorage errors
        }
      }
      return
    }

    // If initialTheme is provided, it takes precedence - apply it and skip localStorage
    if (initialTheme) {
      // Apply initialTheme immediately to prevent flash
      if (initialTheme === "dark") {
        root.classList.add("dark")
      } else if (initialTheme === "light") {
        root.classList.remove("dark")
      } else {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        root.classList.toggle("dark", systemTheme === "dark")
      }
    }
    // Apply theme from localStorage immediately (before paint) - only if no initialTheme
    else if (persistToStorage) {
      try {
        const stored = localStorage.getItem(storageKey) as Theme | null
        if (stored && (stored === "light" || stored === "dark" || stored === "system")) {
          setThemeState(stored)
          // Apply immediately to prevent flash
          if (stored === "dark") {
            root.classList.add("dark")
          } else if (stored === "light") {
            root.classList.remove("dark")
          } else {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light"
            root.classList.toggle("dark", systemTheme === "dark")
          }
        } else {
          // Apply default theme
          setThemeState(defaultTheme)
          if (defaultTheme === "dark") {
            root.classList.add("dark")
          } else if (defaultTheme === "light") {
            root.classList.remove("dark")
          } else {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light"
            root.classList.toggle("dark", systemTheme === "dark")
          }
        }
      } catch {
        // Ignore localStorage errors
      }
    } else {
      // Apply default theme if not persisting
      setThemeState(defaultTheme)
      if (defaultTheme === "dark") {
        root.classList.add("dark")
      } else if (defaultTheme === "light") {
        root.classList.remove("dark")
      } else {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        root.classList.toggle("dark", systemTheme === "dark")
      }
    }

    setResolvedTheme(root.classList.contains("dark") ? "dark" : "light")
    setMounted(true)
  }, [storageKey, persistToStorage, defaultTheme, initialTheme])

  // Listen for storage changes from other tabs/windows
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        const newTheme = e.newValue as Theme
        if (newTheme === "light" || newTheme === "dark" || newTheme === "system") {
          setThemeState(newTheme)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [storageKey])

  // Use useLayoutEffect to check and apply theme synchronously before paint
  // This prevents flashing when PageThemeSetter is active
  React.useLayoutEffect(() => {
    if (!mounted) return

    const root = document.documentElement

    // Check if PageThemeSetter is active by checking data attribute (more reliable than context)
    // Check synchronously to prevent any theme application before PageThemeSetter runs
    const isPageThemeActiveDOM = root.hasAttribute("data-page-theme-active")

    // If PageThemeSetter is active, defer to it and don't apply theme changes
    if (isPageThemeActiveDOM || isPageThemeActive) {
      return
    }

    const applyTheme = (themeToApply: Theme, disableTransitions = false) => {
      if (disableTransitions) {
        root.classList.add("no-transitions")
        root.setAttribute("data-theme-changing", "")
      }

      if (themeToApply === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        root.classList.toggle("dark", systemTheme === "dark")
      } else {
        root.classList.toggle("dark", themeToApply === "dark")
      }

      if (disableTransitions) {
        setTimeout(() => root.classList.remove("no-transitions"), 400)
        // data-theme-changing cleared by FiltersAccordion on close (not timeout - would retrigger accordion animation)
      }
    }

    // Only disable transitions if theme actually changed (not on initial mount)
    const shouldDisableTransitions =
      previousThemeRef.current !== null && previousThemeRef.current !== theme
    applyTheme(theme, shouldDisableTransitions)
    previousThemeRef.current = theme
    setResolvedTheme(getResolvedTheme())

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system", true)
        setResolvedTheme(getResolvedTheme())
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, mounted, isPageThemeActive, getResolvedTheme])

  const setTheme = React.useCallback(
    async (newTheme: Theme) => {
      setThemeState(newTheme)

      // Save to localStorage as cache/fallback
      if (persistToStorage) {
        try {
          localStorage.setItem(storageKey, newTheme)
        } catch {
          // Ignore localStorage errors
        }
      }

      // Call the database persistence callback if provided
      if (onThemeChange) {
        try {
          await onThemeChange(newTheme)
        } catch (error) {
          console.error("Failed to persist theme preference:", error)
        }
      }
    },
    [storageKey, persistToStorage, onThemeChange]
  )

  const value = React.useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      mounted,
    }),
    [theme, resolvedTheme, setTheme, mounted]
  )

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
