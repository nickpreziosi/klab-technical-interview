"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme, type Theme } from "../providers/theme-provider"
import { useIsPageThemeActive } from "@/ui/shared/components/page-theme-setter"
import { CycleToggle, type CycleToggleOption } from "./cycle-toggle"
import { ToggleGroup, ToggleGroupItem } from "./toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"
import { cn } from "../utils/utils"

export type ThemeToggleMode = "cycle" | "toggle-group"

export interface ThemeToggleProps {
  /** Display mode: "cycle" (default, uses CycleToggle) or "toggle-group" (uses ToggleGroup) */
  mode?: ThemeToggleMode
  /** Layout variant: "sidebar" for sidebar use, "default" for general use (only applies to cycle mode) */
  layout?: "sidebar" | "default"
  /** Custom className */
  className?: string
  /** Theme value (for controlled usage) */
  theme?: Theme
  /** Theme change handler (for controlled usage) */
  onThemeChange?: (theme: Theme) => void
}

export function ThemeToggle({
  mode = "cycle",
  layout = "default",
  className,
  theme: controlledTheme,
  onThemeChange: controlledOnThemeChange,
}: ThemeToggleProps) {
  const { theme: contextTheme, setTheme: contextSetTheme, mounted } = useTheme()

  // Use controlled props if provided, otherwise use context theme
  // We always use contextTheme for selection/cycling, even when PageThemeSetter is active
  // This allows users to change their preference on locked pages (it's saved but DOM is overridden)
  const theme = controlledTheme ?? contextTheme
  const setTheme = controlledOnThemeChange ?? contextSetTheme

  // Warn in development if no theme source is available
  if (process.env.NODE_ENV === "development" && !controlledTheme && !contextTheme) {
    console.warn(
      "ThemeToggle: No theme value available. Either wrap in ThemeProvider or provide controlled props (theme and onThemeChange)."
    )
  }

  const [mountedState, setMountedState] = React.useState(false)

  React.useEffect(() => {
    setMountedState(true)
  }, [])

  // Don't show selected state until mounted to prevent flashing
  const safeTheme = mounted && mountedState ? theme : undefined

  const themeOptions: CycleToggleOption<Theme>[] = [
    {
      value: "light",
      icon: Sun,
      label: "Light",
    },
    {
      value: "dark",
      icon: Moon,
      label: "Dark",
    },
    {
      value: "system",
      icon: Monitor,
      label: "System",
    },
  ]

  const handleItemClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  // Allow theme changes even when PageThemeSetter is active
  // The preference will be saved and take effect when navigating away from locked pages
  const handleThemeChange = React.useCallback(
    (value: Theme) => {
      setTheme(value)
      // Note: When PageThemeSetter is active, it will override the DOM change,
      // but the preference is still saved for when the user navigates away
    },
    [setTheme]
  )

  if (mode === "cycle") {
    const currentTheme = safeTheme || "system"
    const currentOption = themeOptions.find((opt) => opt.value === currentTheme) ?? themeOptions[0]

    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <CycleToggle
              options={themeOptions}
              value={currentTheme}
              onValueChange={handleThemeChange}
              layout={layout}
              className={className}
              onClick={handleItemClick}
              disableTransitions
            />
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-foreground text-background">
            <p>{currentOption.label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // ToggleGroup mode
  return (
    <TooltipProvider delayDuration={0}>
      <div suppressHydrationWarning className={cn("inline-flex", className)} data-theme-toggle>
        <ToggleGroup
          type="single"
          value={safeTheme}
          onValueChange={(val) => {
            if (val) {
              const root = document.documentElement
              root.classList.add("no-transitions")
              root.setAttribute("data-theme-changing", "")
              setTheme(val as Theme)
              setTimeout(() => root.classList.remove("no-transitions"), 400)
            }
          }}
          className="text-foreground hover:text-foreground bg-background hover:bg-background rounded-app-radius"
        >
          {themeOptions.map((option) => {
            const Icon = option.icon
            return (
              <Tooltip key={option.value}>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value={option.value}
                    aria-label={option.label}
                    className="px-2 text-xs font-medium"
                    style={{
                      backgroundColor:
                        safeTheme === option.value ? "hsl(var(--foreground))" : "transparent",
                      color: safeTheme === option.value ? "hsl(var(--background))" : undefined,
                    }}
                    onClick={handleItemClick}
                    onMouseDown={handleItemClick}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-foreground text-background">
                  <p>
                    <span className="sr-only">Theme: </span>
                    {option.label}
                  </p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </ToggleGroup>
      </div>
    </TooltipProvider>
  )
}

/**
 * Wrapper component that automatically hides ThemeToggle when PageThemeSetter is active.
 * Use this instead of ThemeToggle directly if you want it to auto-hide on locked theme pages.
 */
export function AutoHideThemeToggle(props: ThemeToggleProps) {
  const isPageThemeActive = useIsPageThemeActive()
  const [isPageThemeActiveDOM, setIsPageThemeActiveDOM] = React.useState(() => {
    if (typeof window === "undefined") return false
    return document.documentElement.hasAttribute("data-page-theme-active")
  })

  React.useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver(() => {
      setIsPageThemeActiveDOM(root.hasAttribute("data-page-theme-active"))
    })

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-page-theme-active"],
    })

    return () => observer.disconnect()
  }, [])

  // Hide when theme is locked
  if (isPageThemeActiveDOM || isPageThemeActive) {
    return null
  }

  return <ThemeToggle {...props} />
}
