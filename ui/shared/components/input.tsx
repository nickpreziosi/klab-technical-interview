"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "../utils/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement | null>(null)
    const cursorPositionRef = React.useRef<{ start: number; end: number } | null>(null)

    const isPasswordType = type === "password"

    // Combined ref callback
    const setInputRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ;(ref as React.MutableRefObject<HTMLInputElement | null>).current = node
        }
      },
      [ref]
    )

    const togglePasswordVisibility = () => {
      // Save cursor position before toggling
      const input = inputRef.current
      if (input) {
        const start = input.selectionStart ?? 0
        const end = input.selectionEnd ?? 0
        cursorPositionRef.current = { start, end }
      }
      setShowPassword((prev) => !prev)
    }

    // Restore cursor position after password visibility toggle
    React.useEffect(() => {
      if (isPasswordType && cursorPositionRef.current && inputRef.current) {
        const { start, end } = cursorPositionRef.current
        // Use requestAnimationFrame to ensure DOM has updated
        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(start, end)
            cursorPositionRef.current = null // Clear after restoring
          }
        })
      }
    }, [showPassword, isPasswordType])

    const inputType = isPasswordType && showPassword ? "text" : type

    if (isPasswordType) {
      return (
        <div className={cn("relative w-full", className)}>
          <input
            type={inputType}
            className="flex h-9 w-full rounded-app-radius border border-input bg-transparent px-3 py-1 pr-10 text-base shadow-sm transition-[background-color,border-color] duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-input-placeholder disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            ref={setInputRef}
            {...props}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            onMouseDown={(e) => {
              e.preventDefault()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-150"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      )
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-app-radius border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-[background-color,border-color] duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-input-placeholder disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
