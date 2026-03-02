"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "../utils/utils"
import { Button } from "./button"
import { Input } from "./input"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/ui/shared/components/command"
import { Popover, PopoverContent, PopoverAnchor } from "@/ui/shared/components/popover"
import { Label } from "@/ui/shared/components/label"

export interface ComboboxOption {
  value: string
  label: string
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
  onBlur?: () => void
  onOpenChange?: (open: boolean) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  disabled?: boolean
  /** Hide the selected value in the input (useful for floating labels) */
  hideValue?: boolean
  "aria-describedby"?: string
  /** Optional label text. When provided, renders a Label component above the combobox. */
  label?: string
  /** Optional id for the combobox. If not provided, one will be generated. Useful for composition with Label component. */
  id?: string
  /** Autocomplete attribute for the input. Defaults to "off". */
  autoComplete?: string
}

export function Combobox({
  options,
  value: controlledValue,
  onValueChange,
  onBlur,
  onOpenChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No option found.",
  className,
  disabled = false,
  hideValue = false,
  "aria-describedby": ariaDescribedBy,
  label,
  id: providedId,
  autoComplete = "off",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const generatedId = React.useId()
  const comboboxId = providedId ?? generatedId

  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = React.useState<string>("")

  // Use controlled value if provided, otherwise use internal state
  const value = controlledValue !== undefined ? controlledValue : internalValue

  // Memoize handleValueChange to avoid dependency issues
  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (controlledValue === undefined) {
        // Uncontrolled mode - update internal state
        setInternalValue(newValue)
      }
      // Always call the callback if provided
      onValueChange?.(newValue)
    },
    [controlledValue, onValueChange]
  )

  const selectedOption = options.find((option) => option.value === value)

  // Filter options based on search
  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return options
    const searchLower = search.toLowerCase()
    return options.filter((option) => option.label.toLowerCase().includes(searchLower))
  }, [options, search])

  // Reset search when popover closes
  React.useEffect(() => {
    if (!open) {
      setSearch("")
    }
  }, [open])

  const listRef = React.useRef<HTMLDivElement>(null)
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)

  // Handle keyboard navigation
  React.useEffect(() => {
    if (!open) {
      setHighlightedIndex(-1)
      return
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1))
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        e.preventDefault()
        const option = filteredOptions[highlightedIndex]
        if (option) {
          const newValue = option.value === value ? "" : option.value
          handleValueChange(newValue)
          setOpen(false)
          setSearch("")
        }
      } else if (e.key === "Escape") {
        setOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, filteredOptions, highlightedIndex, value, handleValueChange])

  // Scroll highlighted item into view
  React.useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll("[cmdk-item]")
      const item = items[highlightedIndex] as HTMLElement
      if (item) {
        item.scrollIntoView({ block: "nearest" })
      }
    }
  }, [highlightedIndex])

  // Extract height and border-color classes from className to apply to Input
  const heightClasses = React.useMemo(() => {
    if (!className) return ""
    const heightMatch = className.match(/\bh-\d+\b/)
    return heightMatch ? heightMatch[0] : ""
  }, [className])

  // Extract border-color classes (border-destructive, border-error, etc.) to apply to Input
  const borderColorClasses = React.useMemo(() => {
    if (!className) return ""
    // Match border-color classes like border-destructive, border-error, border-primary, etc.
    const borderColorMatch = className.match(/\bborder-(?:destructive|error|warning|success|primary|secondary|accent|muted|input|\w+)/g)
    return borderColorMatch ? borderColorMatch.join(" ") : ""
  }, [className])

  // Extract placeholder color classes (placeholder:text-destructive, etc.) to apply to Input
  const placeholderColorClasses = React.useMemo(() => {
    if (!className) return ""
    // Match placeholder color classes like placeholder:text-destructive
    const placeholderMatch = className.match(/\bplaceholder:text-(?:destructive|error|warning|success|primary|secondary|accent|muted|foreground|\w+)/g)
    return placeholderMatch ? placeholderMatch.join(" ") : ""
  }, [className])

  // Remove border-color classes from inner wrapper className (they'll be on Input)
  // Keep other classes like "peer", etc. on inner wrapper
  const wrapperClassName = React.useMemo(() => {
    if (!className) return ""
    return className
      .replace(/\bborder-(?:destructive|error|warning|success|primary|secondary|accent|muted|input|\w+)/g, "")
      .trim()
  }, [className])

  // Handle popover open/close changes
  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen)
      // Call onBlur when popover closes to trigger validation
      // This handles the case when user clicks outside the popover
      if (!newOpen && onBlur) {
        // Use setTimeout to ensure the popover close completes first
        setTimeout(() => {
          onBlur()
        }, 0)
      }
      // Call the external onOpenChange callback if provided
      onOpenChange?.(newOpen)
    },
    [onOpenChange, onBlur]
  )

  // Handle input blur - call onBlur when input loses focus
  // This handles the case when input loses focus while popover is closed
  const handleInputBlur = React.useCallback(() => {
    // Only call onBlur if popover is closed (to avoid double-calling)
    // When popover closes, handleOpenChange will call onBlur
    if (!open && onBlur) {
      onBlur()
    }
  }, [open, onBlur])

  return (
    <div className={cn("space-y-2 w-full", className)}>
      {label && (
        <Label htmlFor={comboboxId} className="mb-2">
          {label}
        </Label>
      )}
      <div className={cn("relative w-full", wrapperClassName)}>
        <Popover open={open} onOpenChange={handleOpenChange} modal={false}>
          <PopoverAnchor asChild>
            <div className="relative">
                <Input
                ref={inputRef}
                id={comboboxId}
                type="text"
                autoComplete={autoComplete}
                placeholder={hideValue ? (placeholder === " " ? "" : placeholder) : (selectedOption ? selectedOption.label : placeholder)}
                value={open ? search : hideValue ? "" : (selectedOption?.label || "")}
                onChange={(e) => {
                  const newSearch = e.target.value
                  setSearch(newSearch)
                  setHighlightedIndex(-1)
                  if (!open) setOpen(true)
                }}
                onFocus={() => {
                  setOpen(true)
                }}
                onBlur={handleInputBlur}
                onClick={() => {
                  setOpen(true)
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
                    e.preventDefault()
                    // Let the useEffect handle keyboard navigation
                  }
                  if (e.key === "Escape") {
                    setOpen(false)
                  }
                }}
                disabled={disabled}
                className={cn("pr-8 text-base md:text-sm", heightClasses, borderColorClasses, placeholderColorClasses)}
                aria-describedby={ariaDescribedBy}
              />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-2"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setOpen(!open)
                if (!open) {
                  setTimeout(() => inputRef.current?.focus(), 0)
                }
              }}
              disabled={disabled}
            >
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </Button>
          </div>
        </PopoverAnchor>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 glass-morphism !mx-0"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            // Don't close if clicking on the input
            const target = e.target as Node
            if (inputRef.current?.contains(target)) {
              e.preventDefault()
            }
          }}
          onEscapeKeyDown={() => {
            setOpen(false)
          }}
        >
          <Command shouldFilter={false}>
            <CommandList ref={listRef}>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option, index) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    disabled={false}
                    onSelect={() => {
                      // Prevent cmdk from auto-selecting on hover - we handle selection in onClick only
                      return
                    }}
                    className={cn(
                      "cursor-pointer pointer-events-auto w-full flex items-center justify-between",
                      index === highlightedIndex && "bg-accent/50 text-accent-foreground"
                    )}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onMouseDown={(e) => {
                      // Handle selection on mousedown to ensure it works
                      e.preventDefault()
                      const newValue = option.value === value ? "" : option.value
                      handleValueChange(newValue)
                      setOpen(false)
                      setSearch("")
                    }}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      </div>
    </div>
  )
}
