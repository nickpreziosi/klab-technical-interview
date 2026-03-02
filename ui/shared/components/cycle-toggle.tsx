"use client"

import * as React from "react"
import { Button } from "./button"
import { cn } from "../utils/utils"

export interface CycleToggleOption<T = string> {
  /** The value for this option */
  value: T
  /** Icon component to display */
  icon?: React.ComponentType<{ className?: string }>
  /** Label text (for accessibility) */
  label?: string
  /** Custom content to render instead of icon */
  content?: React.ReactNode
  /** Button variant when this option is active (e.g., "accent-brand" for recording state) */
  variant?: "default" | "ghost" | "accent-brand" | "accent-brand-outline" | "destructive"
}

export interface CycleToggleProps<T = string> extends Omit<
  React.ComponentProps<typeof Button>,
  "variant" | "size" | "className" | "value"
> {
  /** Array of options to cycle through */
  options: CycleToggleOption<T>[]
  /** Current value */
  value: T
  /** Callback when value changes */
  onValueChange: (value: T) => void
  /** Size variant */
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "icon"
  /** Layout variant: "sidebar" for sidebar use, "default" for general use */
  layout?: "sidebar" | "default"
  /** Disable transitions during change (useful for theme changes) */
  disableTransitions?: boolean
  /** Custom className for the button */
  className?: string
}

/**
 * CycleToggle - An extensible toggle component that cycles through a set of values
 *
 * @example
 * ```tsx
 * <CycleToggle
 *   options={[
 *     { value: "light", icon: Sun, label: "Light" },
 *     { value: "dark", icon: Moon, label: "Dark" },
 *     { value: "system", icon: Monitor, label: "System" }
 *   ]}
 *   value={theme}
 *   onValueChange={setTheme}
 * />
 * ```
 */
function CycleToggleInner<T = string>(
  {
    options,
    value,
    onValueChange,
    size = "icon",
    layout = "default",
    disableTransitions = false,
    className,
    onClick,
    ...props
  }: CycleToggleProps<T>,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!mounted) return

      // Find current index
      const currentIndex = options.findIndex((opt) => opt.value === value)
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % options.length
      const nextValue = options[nextIndex].value

      // Add no-transitions BEFORE state update so accordion doesn't animate on re-render
      // data-theme-changing is cleared by FiltersAccordion when it closes (not by timeout - removing it
      // would restore accordion animation and trigger it to run)
      if (disableTransitions) {
        const root = window.document.documentElement
        root.classList.add("no-transitions")
        root.setAttribute("data-theme-changing", "")
        onValueChange(nextValue)
        setTimeout(() => root.classList.remove("no-transitions"), 400)
      } else {
        onValueChange(nextValue)
      }

      onClick?.(e)
    },
    [mounted, options, value, onValueChange, disableTransitions, onClick]
  )

  // Find current option
  const currentOption = options.find((opt) => opt.value === value) ?? options[0]
  const CurrentIcon = currentOption.icon

  // Wait for mounted state and ensure value is valid before rendering icon
  const isReady = mounted && options.some((opt) => opt.value === value)

  // Determine button variant from current option or default to ghost
  const buttonVariant = currentOption.variant || "ghost"

  // Size classes based on size prop and layout
  const getSizeClass = () => {
    if (layout === "sidebar") {
      return "h-9 w-9"
    }
    switch (size) {
      case "sm":
        return "h-8 w-8"
      case "md":
        return "h-9 w-9"
      case "lg":
        return "h-10 w-10"
      case "xl":
        return "h-11 w-11"
      case "2xl":
        return "h-12 w-12"
      case "3xl":
        return "h-14 w-14"
      case "4xl":
        return "h-16 w-16"
      case "icon":
      default:
        return "h-10 w-10"
    }
  }

  // Icon size based on button size
  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "h-3 w-3"
      case "md":
        return "h-4 w-4"
      case "lg":
      case "xl":
        return "h-5 w-5"
      case "2xl":
        return "h-6 w-6"
      case "3xl":
        return "h-7 w-7"
      case "4xl":
        return "h-8 w-8"
      case "icon":
      default:
        return "h-4 w-4"
    }
  }

  const sizeClass = getSizeClass()
  const iconSize = getIconSize()

  // Filter out className from props to ensure it's not passed to children
  const { className: _ignoredClassName, ...cleanProps } = props as Record<string, unknown>

  // Map invalid sizes to valid Button sizes
  const buttonSize: "sm" | "md" | "lg" | "xl" | "icon" | undefined = 
    size === "icon" ? "icon" : 
    size === "2xl" || size === "3xl" || size === "4xl" ? "xl" : 
    size

  return (
    <Button
      ref={ref}
      variant={buttonVariant}
      size={buttonSize}
      onClick={handleClick}
      className={cn(
        sizeClass,
        "p-0 rounded-full transition-all relative",
        layout === "sidebar" && "flex-1 !my-0",
        className
      )}
      aria-label={currentOption.label || `Toggle ${currentOption.value}`}
      {...cleanProps}
    >
      {!isReady ? (
        // Show placeholder while state is loading
        <div className={cn(iconSize, "opacity-0")} aria-hidden="true" />
      ) : currentOption.content ? (
        currentOption.content
      ) : CurrentIcon ? (
        <div className="flex items-center justify-center" data-allow-transition>
          {/* Render all icons with transitions for smooth animation */}
          {options.map((option) => {
            const Icon = option.icon
            if (!Icon) return null

            const isActive = option.value === value
            return (
              <Icon
                key={option.value as string}
                className={cn(
                  iconSize,
                  "transition-all absolute",
                  isActive ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
                )}
              />
            )
          })}
        </div>
      ) : (
        <span className="text-xs">{String(currentOption.value)}</span>
      )}
      <span className="sr-only">{currentOption.label || `Current: ${currentOption.value}`}</span>
    </Button>
  )
}

export const CycleToggle = React.forwardRef(CycleToggleInner) as <T = string>(
  props: CycleToggleProps<T> & { ref?: React.ForwardedRef<HTMLButtonElement> }
) => React.ReactElement

if (typeof CycleToggle !== "undefined") {
  (CycleToggle as React.ComponentType<unknown> & { displayName?: string }).displayName = "CycleToggle"
}
