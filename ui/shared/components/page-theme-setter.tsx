"use client"

import { useEffect, useLayoutEffect, useRef } from "react"
import * as React from "react"
import { useTheme, type Theme } from "../providers/theme-provider"

// Use a global symbol to ensure context is shared across npm package and consuming app bundles
const PAGE_THEME_CONTEXT_KEY = Symbol.for("k-lab-components-page-theme-context")

interface PageThemeContextValue {
  isActive: boolean
  theme: Theme | null
}

function getPageThemeContext(): React.Context<PageThemeContextValue> {
  const globalObj = typeof globalThis !== "undefined" ? globalThis : window

  if (!(globalObj as Record<symbol, unknown>)[PAGE_THEME_CONTEXT_KEY]) {
    ;(globalObj as Record<symbol, unknown>)[PAGE_THEME_CONTEXT_KEY] =
      React.createContext<PageThemeContextValue>({ isActive: false, theme: null })
  }

  return (globalObj as Record<symbol, unknown>)[
    PAGE_THEME_CONTEXT_KEY
  ] as React.Context<PageThemeContextValue>
}

const PageThemeContext = getPageThemeContext()

/**
 * Hook to check if PageThemeSetter is currently active.
 * Used by ThemeProvider to defer theme application when PageThemeSetter is active.
 */
export function useIsPageThemeActive() {
  return React.useContext(PageThemeContext).isActive
}

/**
 * Hook to get the effective theme - returns the page theme if PageThemeSetter is active,
 * otherwise returns the theme from ThemeProvider context.
 * This ensures components respect page-level theme overrides.
 */
export function useEffectiveTheme(): Theme {
  const pageThemeContext = React.useContext(PageThemeContext)
  const { theme: contextTheme } = useTheme()

  // If PageThemeSetter is active, use its theme
  if (pageThemeContext.isActive && pageThemeContext.theme) {
    return pageThemeContext.theme
  }

  // Otherwise, use context theme
  return contextTheme
}

/**
 * Hook to read the actual theme from the DOM (based on dark class).
 * Useful when you need the actual rendered theme, not the context state.
 */
export function useDOMTheme(): "light" | "dark" {
  const [domTheme, setDomTheme] = React.useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light"
    return document.documentElement.classList.contains("dark") ? "dark" : "light"
  })

  React.useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver(() => {
      const isDark = root.classList.contains("dark")
      setDomTheme(isDark ? "dark" : "light")
    })

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  return domTheme
}

export interface PageThemeSetterProps {
  /**
   * The theme to apply for this page
   */
  theme: Theme
  /**
   * Whether to restore the previous theme when the component unmounts.
   * Defaults to true.
   */
  restoreOnUnmount?: boolean
}

/**
 * Component that sets a specific theme for a page and optionally
 * restores the previous theme when unmounted.
 *
 * @example
 * ```tsx
 * // In a page component
 * export default function MyPage() {
 *   return (
 *     <>
 *       <PageThemeSetter theme="light" />
 *       <div>My page content</div>
 *     </>
 *   )
 * }
 * ```
 */
export function PageThemeSetter({ theme, restoreOnUnmount = true }: PageThemeSetterProps) {
  const { theme: providerTheme } = useTheme()
  const previousThemeRef = useRef<Theme | null>(null)
  const themeRef = useRef(theme)

  // Keep themeRef in sync with theme prop (in effect to avoid ref update during render)
  React.useEffect(() => {
    themeRef.current = theme
  }, [theme])

  // Helper function to apply theme to DOM
  const applyThemeToDOM = (themeToApply: Theme) => {
    const root = document.documentElement
    // Set data attribute to signal that PageThemeSetter is active
    root.setAttribute("data-page-theme-active", "true")
    root.setAttribute("data-page-theme", themeToApply)

    if (themeToApply === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.toggle("dark", systemTheme === "dark")
    } else {
      root.classList.toggle("dark", themeToApply === "dark")
    }
  }

  // Apply theme immediately on mount - runs once synchronously before paint
  useLayoutEffect(() => {
    const root = document.documentElement

    // Capture the initial theme once (before we change it)
    if (previousThemeRef.current === null) {
      // Determine current theme from DOM class (more reliable than state)
      const isDark = root.classList.contains("dark")
      previousThemeRef.current = isDark ? "dark" : "light"
    }

    // Set data attribute FIRST to signal ThemeProvider to defer
    root.setAttribute("data-page-theme-active", "true")
    root.setAttribute("data-page-theme", theme)

    // Apply the page theme immediately on mount (override any theme from root layout script)
    applyThemeToDOM(theme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty deps - runs once on mount, theme is captured from props

  // Apply theme whenever the page theme prop changes
  useLayoutEffect(() => {
    applyThemeToDOM(theme)
  }, [theme])

  // React to provider theme changes and re-apply page theme synchronously before paint
  // This prevents flashing when user toggles theme while on a page with PageThemeSetter
  useLayoutEffect(() => {
    // Re-apply the page theme whenever provider theme changes (read from ref for latest value)
    // This overrides any theme changes from ThemeProvider before the browser paints
    applyThemeToDOM(themeRef.current)
  }, [providerTheme])

  // Don't update ThemeProvider state when PageThemeSetter is active
  // This prevents ThemeProvider from trying to apply theme changes
  // The DOM manipulation above is sufficient - ThemeProvider defers to us

  // Restore previous theme on unmount if requested
  useEffect(() => {
    if (!restoreOnUnmount) return

    return () => {
      const root = document.documentElement
      // Remove data attributes when unmounting
      root.removeAttribute("data-page-theme-active")
      root.removeAttribute("data-page-theme")

      // Use themeRef.current to get the latest theme value at unmount time
      if (previousThemeRef.current !== null && previousThemeRef.current !== themeRef.current) {
        applyThemeToDOM(previousThemeRef.current)
        // Note: We apply DOM change directly. The theme provider will sync on next mount if needed.
      }
    }
  }, [restoreOnUnmount]) // Only depend on restoreOnUnmount to run cleanup on unmount

  // Signal to ThemeProvider that PageThemeSetter is active and provide the theme value
  return (
    <PageThemeContext.Provider value={{ isActive: true, theme }}>{null}</PageThemeContext.Provider>
  )
}
