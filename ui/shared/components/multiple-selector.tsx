"use client"

import * as React from "react"
import { X, ChevronsUpDown } from "lucide-react"
import { cn } from "../utils/utils"
import { Input } from "./input"
import { Badge } from "./badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/ui/shared/components/command"
import { Popover, PopoverContent, PopoverAnchor } from "@/ui/shared/components/popover"
import { Button } from "./button"
import { Label } from "@/ui/shared/components/label"

export interface MultipleSelectorOption {
  label: string
  value: string
  group?: string
}

export interface MultipleSelectorProps {
  options: MultipleSelectorOption[]
  selected?: MultipleSelectorOption[]
  onChange?: (selected: MultipleSelectorOption[]) => void
  onBlur?: () => void
  onOpenChange?: (open: boolean) => void
  placeholder?: string
  emptyIndicator?: React.ReactNode
  maxCount?: number
  disabled?: boolean
  className?: string
  badgeClassName?: string
  triggerClassName?: string
  hidePlaceholderWhenSelected?: boolean
  creatable?: boolean
  onSearch?: (search: string) => void
  loading?: boolean
  "aria-describedby"?: string
  /** Optional label text. When provided, renders a Label component above the selector. */
  label?: string
  /** Optional id for the selector. If not provided, one will be generated. Useful for composition with Label component. */
  id?: string
}

export function MultipleSelector({
  options,
  selected = [],
  onChange,
  onBlur,
  onOpenChange,
  placeholder = "Select items...",
  emptyIndicator,
  maxCount,
  disabled = false,
  className,
  badgeClassName,
  triggerClassName,
  hidePlaceholderWhenSelected = false,
  creatable = false,
  onSearch,
  loading = false,
  "aria-describedby": ariaDescribedBy,
  label,
  id: providedId,
}: MultipleSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const [creatableValue, setCreatableValue] = React.useState("")
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)
  const generatedId = React.useId()
  const selectorId = providedId ?? generatedId

  const handleUnselect = React.useCallback(
    (option: MultipleSelectorOption) => {
      const newSelected = selected.filter((s) => s.value !== option.value)
      onChange?.(newSelected)
    },
    [selected, onChange]
  )

  const handleSelect = React.useCallback(
    (option: MultipleSelectorOption) => {
      if (selected.some((s) => s.value === option.value)) {
        handleUnselect(option)
        return
      }

      if (maxCount && selected.length >= maxCount) {
        return
      }

      onChange?.([...selected, option])
    },
    [selected, maxCount, onChange, handleUnselect]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Delete" || e.key === "Backspace") {
      if (inputValue === "" && selected.length > 0) {
        handleUnselect(selected[selected.length - 1])
      }
    }
    if (e.key === "Escape") {
      setOpen(false)
      inputRef.current?.blur()
    }
    if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !open) {
      e.preventDefault()
      setOpen(true)
    }
    // Don't prevent default for ArrowDown/ArrowUp when open - let the global handler work
  }

  const selectables = React.useMemo(() => {
    return options.filter((option) => !selected.some((s) => s.value === option.value))
  }, [options, selected])

  const filteredOptions = React.useMemo(() => {
    if (!inputValue) return selectables

    const searchLower = inputValue.toLowerCase()
    return selectables.filter((option) => option.label.toLowerCase().includes(searchLower))
  }, [selectables, inputValue])

  const handleInputChange = (value: string) => {
    setInputValue(value)
    setHighlightedIndex(-1) // Reset highlight when search changes
    onSearch?.(value)
  }

  // Create a flat array of all filtered options for keyboard navigation
  const flatFilteredOptions = React.useMemo(() => {
    return filteredOptions
  }, [filteredOptions])

  const handleCreate = () => {
    if (!creatableValue.trim()) return

    const newOption: MultipleSelectorOption = {
      label: creatableValue.trim(),
      value: creatableValue.trim().toLowerCase().replace(/\s+/g, "-"),
    }

    if (!selected.some((s) => s.value === newOption.value)) {
      if (maxCount && selected.length >= maxCount) {
        return
      }
      onChange?.([...selected, newOption])
    }

    setCreatableValue("")
    setInputValue("")
  }

  const groupedOptions = React.useMemo(() => {
    const groups: Record<string, MultipleSelectorOption[]> = {}
    filteredOptions.forEach((option) => {
      const group = option.group || "Other"
      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(option)
    })
    return groups
  }, [filteredOptions])

  const hasGroups = Object.keys(groupedOptions).length > 0 && filteredOptions.some((o) => o.group)

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
        setHighlightedIndex((prev) => (prev < flatFilteredOptions.length - 1 ? prev + 1 : prev))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1))
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        e.preventDefault()
        const option = flatFilteredOptions[highlightedIndex]
        if (option) {
          handleSelect(option)
          // Don't close the popover for multiple select - allow selecting multiple items
        }
      } else if (e.key === "Escape") {
        setOpen(false)
        inputRef.current?.blur()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, flatFilteredOptions, highlightedIndex, handleSelect])

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

  // Focus input when popover opens
  React.useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }, [open])

  // Reset input when popover closes
  React.useEffect(() => {
    if (!open) {
      setInputValue("")
      setHighlightedIndex(-1)
    }
  }, [open])

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

  const content = (
    <Popover open={open} onOpenChange={handleOpenChange} modal={false}>
      <PopoverAnchor asChild>
        <div
          id={selectorId}
          className={cn(
            "relative flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-app-radius border border-input bg-transparent px-3 py-1.5 text-base md:text-sm shadow-sm transition-[background-color,border-color] duration-150",
            "focus-within:outline-2 focus-within:outline focus-within:outline-foreground focus-within:outline-offset-2",
            disabled && "cursor-not-allowed opacity-50",
            triggerClassName
          )}
          onClick={() => {
            if (!disabled) {
              inputRef.current?.focus()
              setOpen(true)
            }
          }}
        >
          {selected.map((option) => (
            <Badge
              key={option.value}
              variant="secondary"
              className={cn("mr-0", badgeClassName)}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleUnselect(option)
              }}
            >
              {option.label}
              <button
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(option)
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleUnselect(option)
                }}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground transition-[color] duration-150" />
              </button>
            </Badge>
          ))}
          <Input
            ref={inputRef}
            id={selectorId}
            type="text"
            placeholder={selected.length === 0 ? placeholder : ""}
            value={inputValue}
            onChange={(e) => {
              const newValue = e.target.value
              setInputValue(newValue)
              handleInputChange(newValue)
              if (!open) {
                setOpen(true)
              }
            }}
            onKeyDown={(e) => {
              handleKeyDown(e)
              if (e.key === "Enter" && creatable && creatableValue.trim()) {
                handleCreate()
              }
            }}
            onFocus={() => {
              if (!disabled) {
                setOpen(true)
              }
            }}
            onBlur={handleInputBlur}
            disabled={disabled}
            className={cn(
              "flex-1 min-w-[120px] h-auto border-0 p-0 text-base md:text-sm focus-visible:outline-none shadow-none",
              // Extract placeholder color classes from triggerClassName
              triggerClassName
                ?.match(
                  /\bplaceholder:text-(?:destructive|error|warning|success|primary|secondary|accent|muted|foreground|\w+)/g
                )
                ?.join(" ")
            )}
            aria-describedby={ariaDescribedBy}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2"
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
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </button>
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 !mx-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          // Don't close if clicking on the input
          const target = e.target as Node
          if (inputRef.current?.contains(target)) {
            e.preventDefault()
          }
        }}
      >
        <Command className={className} shouldFilter={false}>
          <CommandList ref={listRef}>
            {loading && <div className="py-2 text-center text-sm">Loading...</div>}
            {!loading && filteredOptions.length === 0 && !creatable && (
              <CommandEmpty className="p-2 text-sm">
                {emptyIndicator || "No results found."}
              </CommandEmpty>
            )}
            {!loading && filteredOptions.length === 0 && creatable && inputValue && (
              <CommandEmpty>
                <div className="p-2">
                  <div className="text-sm text-muted-foreground mb-2">
                    No results found. Create &quot;{inputValue}&quot;?
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCreatableValue(inputValue)
                      handleCreate()
                    }}
                  >
                    Create
                  </Button>
                </div>
              </CommandEmpty>
            )}
            {!loading && hasGroups ? (
              Object.entries(groupedOptions).map(([group, groupOptions]) => (
                <CommandGroup key={group} heading={group}>
                  {groupOptions.map((option, index) => {
                    // Calculate global index for highlightedIndex
                    const globalIndex =
                      Object.keys(groupedOptions)
                        .slice(0, Object.keys(groupedOptions).indexOf(group))
                        .reduce((acc, key) => acc + groupedOptions[key].length, 0) + index
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        disabled={false}
                        onSelect={() => {
                          // Prevent cmdk from auto-selecting on hover - we handle selection in onMouseDown only
                          return
                        }}
                        onMouseDown={(e) => {
                          // Handle selection on mousedown to ensure it works
                          e.preventDefault()
                          handleSelect(option)
                        }}
                        className={cn(
                          "cursor-pointer pointer-events-auto justify-start",
                          globalIndex === highlightedIndex && "bg-accent/50 text-accent-foreground"
                        )}
                        onMouseEnter={() => setHighlightedIndex(globalIndex)}
                      >
                        {option.label}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              ))
            ) : (
              <CommandGroup>
                {filteredOptions.map((option, index) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    disabled={false}
                    onSelect={() => {
                      // Prevent cmdk from auto-selecting on hover - we handle selection in onMouseDown only
                      return
                    }}
                    onMouseDown={(e) => {
                      // Handle selection on mousedown to ensure it works
                      e.preventDefault()
                      handleSelect(option)
                    }}
                    className={cn(
                      "cursor-pointer pointer-events-auto justify-start",
                      index === highlightedIndex && "bg-accent/50 text-accent-foreground"
                    )}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {maxCount && selected.length >= maxCount && (
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                Maximum {maxCount} items selected
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )

  // Only wrap with label container if label is provided
  if (label) {
    return (
      <div className="space-y-2">
        <Label htmlFor={selectorId} className="mb-2">
          {label}
        </Label>
        {content}
      </div>
    )
  }

  return content
}
