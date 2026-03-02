"use client"

import * as React from "react"
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { type DayButton, DayPicker, getDefaultClassNames, useDayPicker } from "react-day-picker"
import type { DropdownProps } from "react-day-picker"

import { cn } from "../utils/utils"
import { Button, buttonVariants } from "./button"
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/shared/components/popover"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "dropdown",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-transparent group/calendar p-3 [[data-slot=card-content]_&]:bg-background [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("flex gap-4 flex-col md:flex-row relative", defaultClassNames.months),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between pointer-events-none [&>*]:pointer-events-auto",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-9 w-9 aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-9 w-9 aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-9 w-full px-9",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-medium justify-center h-9 gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn("relative", defaultClassNames.dropdown_root),
        dropdown: cn("hidden", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "rounded-app-radius pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground rounded-app-radius flex-1 font-normal text-[0.8rem] select-none",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        week_number_header: cn("select-none w-9", defaultClassNames.week_number_header),
        week_number: cn(
          "text-[0.8rem] select-none text-muted-foreground",
          defaultClassNames.week_number
        ),
        day: cn(
          "relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
          defaultClassNames.day
        ),
        today: cn(
          "text-accent-brand rounded-app-radius data-[selected=true]:rounded-app-radius",
          defaultClassNames.today
        ),
        range_start: cn(
          "!rounded-none !rounded-l-md bg-accent-brand",
          defaultClassNames.range_start
        ),
        range_middle: cn("!rounded-none bg-accent-brand", defaultClassNames.range_middle),
        range_end: cn("!rounded-none !rounded-r-md bg-accent-brand", defaultClassNames.range_end),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className={cn("size-4", className)} {...props} />
          }

          if (orientation === "right") {
            return <ChevronRightIcon className={cn("size-4", className)} {...props} />
          }

          return <ChevronDownIcon className={cn("size-4", className)} {...props} />
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex h-9 w-9 items-center justify-center text-center">{children}</div>
            </td>
          )
        },
        MonthsDropdown: (props) => {
          // Pass all props including options, value, onChange, etc.
          return <MonthDropdown {...props} />
        },
        YearsDropdown: (props) => {
          // Pass all props including options, value, onChange, etc.
          return <YearDropdown {...props} />
        },
        Dropdown: (props) => {
          const { name, value, onChange, options, ...rest } = props
          if (name === "month") {
            return (
              <MonthDropdown
                name={name}
                value={value}
                onChange={onChange}
                options={options}
                {...rest}
              />
            )
          }
          if (name === "year") {
            return (
              <YearDropdown
                name={name}
                value={value}
                onChange={onChange}
                options={options}
                {...rest}
              />
            )
          }
          // Fallback to default for other dropdown types
          return <select name={name} value={value} onChange={onChange} {...rest} />
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-accent-brand data-[selected-single=true]:text-white data-[range-middle=true]:bg-accent-brand data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-accent-brand data-[range-start=true]:text-white data-[range-end=true]:bg-accent-brand data-[range-end=true]:text-white group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-9 flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-app-radius data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-app-radius data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70 cursor-pointer",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

// Custom Month Dropdown using Popover
// This is used for both MonthsDropdown and Dropdown with name="month"
function MonthDropdown(props: DropdownProps) {
  const { value, onChange, options: propsOptions = [], classNames, ...rest } = props
  const [open, setOpen] = React.useState(false)
  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null)
  const { formatters } = useDayPicker()
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const selectedButtonRef = React.useRef<HTMLButtonElement | HTMLAnchorElement | null>(null)
  const buttonRefs = React.useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>([])

  // Generate options if not provided
  const options = React.useMemo(() => {
    // Check if options array exists and has items
    if (Array.isArray(propsOptions) && propsOptions.length > 0) {
      return propsOptions
    }
    // Generate months if options not provided
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(2024, i, 1)
      return {
        value: i,
        label:
          formatters?.formatMonthDropdown?.(date) ||
          date.toLocaleString("default", { month: "long" }),
        disabled: false,
      }
    })
  }, [propsOptions, formatters])

  // Find selected option - value can be string or number
  const selectedOption = options.find((opt) => {
    // Handle both string and number comparisons
    const optValue = opt.value
    const propValue = value
    return optValue === propValue || String(optValue) === String(propValue)
  })
  const displayValue = selectedOption?.label || (value !== undefined ? String(value) : "")

  // Initialize focused index to selected option when popover opens
  React.useEffect(() => {
    if (open) {
      const selectedIndex = options.findIndex((opt) => {
        const optValue = opt.value
        const propValue = value
        return optValue === propValue || String(optValue) === String(propValue)
      })
      setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0)
    } else {
      setFocusedIndex(null)
    }
  }, [open, options, value])

  const handleChange = React.useCallback(
    (newValue: number) => {
      // Create a synthetic change event that matches what react-day-picker expects
      // Native select elements have value as a string
      const syntheticEvent = {
        target: {
          value: String(newValue),
          name: props.name || "",
        },
        currentTarget: {
          value: String(newValue),
          name: props.name || "",
        },
      } as unknown as React.ChangeEvent<HTMLSelectElement>

      if (onChange) {
        onChange(syntheticEvent)
      }
      setOpen(false)
    },
    [onChange, props.name, setOpen]
  )

  // Handle keyboard navigation
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!open) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setFocusedIndex((prev) => {
            if (prev === null) {
              const next = 0
              setTimeout(() => {
                const button = buttonRefs.current[next]
                if (button) {
                  button.focus()
                  if ("scrollIntoView" in button) {
                    button.scrollIntoView({ block: "nearest", behavior: "smooth" })
                  }
                }
              }, 0)
              return next
            }
            // Cycle: if at end, go to beginning
            const next = prev >= options.length - 1 ? 0 : prev + 1
            setTimeout(() => {
              const button = buttonRefs.current[next]
              if (button) {
                button.focus()
                if ("scrollIntoView" in button) {
                  button.scrollIntoView({ block: "nearest", behavior: "smooth" })
                }
              }
            }, 0)
            return next
          })
          break
        case "ArrowUp":
          e.preventDefault()
          setFocusedIndex((prev) => {
            if (prev === null) {
              const next = options.length - 1
              setTimeout(() => {
                const button = buttonRefs.current[next]
                if (button) {
                  button.focus()
                  if ("scrollIntoView" in button) {
                    button.scrollIntoView({ block: "nearest", behavior: "smooth" })
                  }
                }
              }, 0)
              return next
            }
            // Cycle: if at beginning, go to end
            const next = prev <= 0 ? options.length - 1 : prev - 1
            setTimeout(() => {
              const button = buttonRefs.current[next]
              if (button) {
                button.focus()
                if ("scrollIntoView" in button) {
                  button.scrollIntoView({ block: "nearest", behavior: "smooth" })
                }
              }
            }, 0)
            return next
          })
          break
        case "Enter":
        case " ":
          e.preventDefault()
          if (focusedIndex !== null && focusedIndex >= 0 && focusedIndex < options.length) {
            const option = options[focusedIndex]
            if (!option.disabled) {
              handleChange(option.value)
            }
          }
          break
        case "Escape":
          e.preventDefault()
          setOpen(false)
          break
        case "Home":
          e.preventDefault()
          setFocusedIndex(0)
          setTimeout(() => {
            const button = buttonRefs.current[0]
            if (button) {
              button.focus()
              if ("scrollIntoView" in button) {
                button.scrollIntoView({ block: "nearest", behavior: "smooth" })
              }
            }
          }, 0)
          break
        case "End":
          e.preventDefault()
          const lastIndex = options.length - 1
          setFocusedIndex(lastIndex)
          setTimeout(() => {
            const button = buttonRefs.current[lastIndex]
            if (button) {
              button.focus()
              if ("scrollIntoView" in button) {
                button.scrollIntoView({ block: "nearest", behavior: "smooth" })
              }
            }
          }, 0)
          break
      }
    },
    [open, options, focusedIndex, handleChange, setOpen]
  )

  // Scroll to selected option when popover opens
  React.useEffect(() => {
    if (!open) return

    const scrollToSelected = () => {
      const container = scrollContainerRef.current
      if (!container) return false

      // Find the selected button by data attribute
      const selectedButton = container.querySelector('[data-selected="true"]') as HTMLButtonElement
      if (!selectedButton) {
        // Fallback: find button with selected styling
        const buttons = container.querySelectorAll("button")
        for (const button of buttons) {
          if (button.classList.contains("bg-accent")) {
            const scrollTop =
              button.offsetTop -
              container.offsetTop -
              container.clientHeight / 2 +
              button.clientHeight / 2
            container.scrollTop = Math.max(0, scrollTop)
            return true
          }
        }
        return false
      }

      // Calculate the scroll position needed to center the button in the container
      const scrollTop =
        selectedButton.offsetTop -
        container.offsetTop -
        container.clientHeight / 2 +
        selectedButton.clientHeight / 2

      container.scrollTop = Math.max(0, scrollTop)
      return true
    }

    // Try immediately with requestAnimationFrame
    const rafId1 = requestAnimationFrame(() => {
      if (!scrollToSelected()) {
        // If first attempt failed, try again after a short delay
        const rafId2 = requestAnimationFrame(() => {
          scrollToSelected()
        })
        return () => cancelAnimationFrame(rafId2)
      }
    })

    // Also try after animation completes as a fallback
    const timeoutId = setTimeout(() => {
      scrollToSelected()
    }, 200)

    return () => {
      cancelAnimationFrame(rafId1)
      clearTimeout(timeoutId)
    }
  }, [open, value])

  if (!options || options.length === 0) {
    // Fallback to native select if no options
    return <select value={value} onChange={onChange} {...rest} />
  }

  // Wrap in span to match react-day-picker's structure (dropdown_root)
  return (
    <span data-disabled={rest.disabled} className={cn(classNames?.dropdown_root, rest.className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            type="button"
            className={cn(
              "h-8 rounded-app-radius pl-2 pr-1 flex items-center gap-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            )}
            disabled={rest.disabled}
          >
            {displayValue}
            <ChevronDownIcon className="size-3.5 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="!w-fit min-w-0 p-1" align="start">
          <div
            ref={scrollContainerRef}
            className="flex flex-col max-h-[200px] overflow-y-auto scrollbar-hide px-1 py-1"
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            {options.map((option, index) => {
              const isSelected = option.value === value || String(option.value) === String(value)
              const isFocused = focusedIndex === index
              return (
                <Button
                  key={option.value}
                  ref={(el) => {
                    buttonRefs.current[index] = el as HTMLButtonElement | HTMLAnchorElement | null
                    if (isSelected) {
                      selectedButtonRef.current = el as HTMLButtonElement | HTMLAnchorElement | null
                    }
                  }}
                  data-selected={isSelected ? "true" : "false"}
                  variant="ghost"
                  type="button"
                  tabIndex={isFocused ? 0 : -1}
                  className={cn(
                    "w-full justify-center text-sm font-normal whitespace-nowrap",
                    isSelected && "bg-accent text-accent-foreground",
                    isFocused && !isSelected && "bg-accent/50",
                    option.disabled && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (!option.disabled) {
                      handleChange(option.value)
                    }
                  }}
                  onFocus={() => setFocusedIndex(index)}
                  disabled={option.disabled}
                >
                  {option.label}
                </Button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </span>
  )
}

// Custom Year Dropdown using Popover
// This is used for both YearsDropdown and Dropdown with name="year"
function YearDropdown(props: DropdownProps) {
  const { value, onChange, options: propsOptions = [], classNames, ...rest } = props
  const [open, setOpen] = React.useState(false)
  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null)
  const { formatters } = useDayPicker()
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const selectedButtonRef = React.useRef<HTMLButtonElement | HTMLAnchorElement | null>(null)
  const buttonRefs = React.useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>([])

  // Generate options if not provided
  const options = React.useMemo(() => {
    // Check if options array exists and has items
    if (Array.isArray(propsOptions) && propsOptions.length > 0) {
      return propsOptions
    }
    // Generate years if options not provided (current year ± 50 years)
    const currentYear = new Date().getFullYear()
    const startYear = currentYear - 50
    const endYear = currentYear + 50
    const years: Array<{ value: number; label: string; disabled: boolean }> = []

    for (let year = startYear; year <= endYear; year++) {
      years.push({
        value: year,
        label: formatters?.formatYearDropdown?.(new Date(year, 0, 1)) || String(year),
        disabled: false,
      })
    }
    return years
  }, [propsOptions, formatters])

  // Find selected option - value can be string or number
  const selectedOption = options.find((opt) => {
    // Handle both string and number comparisons
    const optValue = opt.value
    const propValue = value
    return optValue === propValue || String(optValue) === String(propValue)
  })
  const displayValue = selectedOption?.label || (value !== undefined ? String(value) : "")

  // Initialize focused index to selected option when popover opens
  React.useEffect(() => {
    if (open) {
      const selectedIndex = options.findIndex((opt) => {
        const optValue = opt.value
        const propValue = value
        return optValue === propValue || String(optValue) === String(propValue)
      })
      setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0)
    } else {
      setFocusedIndex(null)
    }
  }, [open, options, value])

  const handleChange = React.useCallback(
    (newValue: number) => {
      // Create a synthetic change event that matches what react-day-picker expects
      // Native select elements have value as a string
      const syntheticEvent = {
        target: {
          value: String(newValue),
          name: props.name || "",
        },
        currentTarget: {
          value: String(newValue),
          name: props.name || "",
        },
      } as unknown as React.ChangeEvent<HTMLSelectElement>

      if (onChange) {
        onChange(syntheticEvent)
      }
      setOpen(false)
    },
    [onChange, props.name, setOpen]
  )

  // Handle keyboard navigation
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!open) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setFocusedIndex((prev) => {
            if (prev === null) {
              const next = 0
              setTimeout(() => {
                const button = buttonRefs.current[next]
                if (button) {
                  button.focus()
                  if ("scrollIntoView" in button) {
                    button.scrollIntoView({ block: "nearest", behavior: "smooth" })
                  }
                }
              }, 0)
              return next
            }
            // Cycle: if at end, go to beginning
            const next = prev >= options.length - 1 ? 0 : prev + 1
            setTimeout(() => {
              const button = buttonRefs.current[next]
              if (button) {
                button.focus()
                if ("scrollIntoView" in button) {
                  button.scrollIntoView({ block: "nearest", behavior: "smooth" })
                }
              }
            }, 0)
            return next
          })
          break
        case "ArrowUp":
          e.preventDefault()
          setFocusedIndex((prev) => {
            if (prev === null) {
              const next = options.length - 1
              setTimeout(() => {
                const button = buttonRefs.current[next]
                if (button) {
                  button.focus()
                  if ("scrollIntoView" in button) {
                    button.scrollIntoView({ block: "nearest", behavior: "smooth" })
                  }
                }
              }, 0)
              return next
            }
            // Cycle: if at beginning, go to end
            const next = prev <= 0 ? options.length - 1 : prev - 1
            setTimeout(() => {
              const button = buttonRefs.current[next]
              if (button) {
                button.focus()
                if ("scrollIntoView" in button) {
                  button.scrollIntoView({ block: "nearest", behavior: "smooth" })
                }
              }
            }, 0)
            return next
          })
          break
        case "Enter":
        case " ":
          e.preventDefault()
          if (focusedIndex !== null && focusedIndex >= 0 && focusedIndex < options.length) {
            const option = options[focusedIndex]
            if (!option.disabled) {
              handleChange(option.value)
            }
          }
          break
        case "Escape":
          e.preventDefault()
          setOpen(false)
          break
        case "Home":
          e.preventDefault()
          setFocusedIndex(0)
          setTimeout(() => {
            const button = buttonRefs.current[0]
            if (button) {
              button.focus()
              if ("scrollIntoView" in button) {
                button.scrollIntoView({ block: "nearest", behavior: "smooth" })
              }
            }
          }, 0)
          break
        case "End":
          e.preventDefault()
          const lastIndex = options.length - 1
          setFocusedIndex(lastIndex)
          setTimeout(() => {
            const button = buttonRefs.current[lastIndex]
            if (button) {
              button.focus()
              if ("scrollIntoView" in button) {
                button.scrollIntoView({ block: "nearest", behavior: "smooth" })
              }
            }
          }, 0)
          break
      }
    },
    [open, options, focusedIndex, handleChange, setOpen]
  )

  // Scroll to selected option when popover opens
  React.useEffect(() => {
    if (!open) return

    const scrollToSelected = () => {
      const container = scrollContainerRef.current
      if (!container) return false

      // Find the selected button by data attribute
      const selectedButton = container.querySelector('[data-selected="true"]') as HTMLButtonElement
      if (!selectedButton) {
        // Fallback: find button with selected styling
        const buttons = container.querySelectorAll("button")
        for (const button of buttons) {
          if (button.classList.contains("bg-accent")) {
            const scrollTop =
              button.offsetTop -
              container.offsetTop -
              container.clientHeight / 2 +
              button.clientHeight / 2
            container.scrollTop = Math.max(0, scrollTop)
            return true
          }
        }
        return false
      }

      // Calculate the scroll position needed to center the button in the container
      const scrollTop =
        selectedButton.offsetTop -
        container.offsetTop -
        container.clientHeight / 2 +
        selectedButton.clientHeight / 2

      container.scrollTop = Math.max(0, scrollTop)
      return true
    }

    // Try immediately with requestAnimationFrame
    const rafId1 = requestAnimationFrame(() => {
      if (!scrollToSelected()) {
        // If first attempt failed, try again after a short delay
        const rafId2 = requestAnimationFrame(() => {
          scrollToSelected()
        })
        return () => cancelAnimationFrame(rafId2)
      }
    })

    // Also try after animation completes as a fallback
    const timeoutId = setTimeout(() => {
      scrollToSelected()
    }, 200)

    return () => {
      cancelAnimationFrame(rafId1)
      clearTimeout(timeoutId)
    }
  }, [open, value])

  if (!options || options.length === 0) {
    // Fallback to native select if no options
    return <select value={value} onChange={onChange} {...rest} />
  }

  // Wrap in span to match react-day-picker's structure (dropdown_root)
  return (
    <span data-disabled={rest.disabled} className={cn(classNames?.dropdown_root, rest.className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            type="button"
            className={cn(
              "h-8 rounded-app-radius pl-2 pr-1 flex items-center gap-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            )}
            disabled={rest.disabled}
          >
            {displayValue}
            <ChevronDownIcon className="size-3.5 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="!w-fit min-w-0 p-1" align="start">
          <div
            ref={scrollContainerRef}
            className="flex flex-col max-h-[200px] overflow-y-auto scrollbar-hide px-1 py-1"
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            {options.map((option, index) => {
              const isSelected = option.value === value || String(option.value) === String(value)
              const isFocused = focusedIndex === index
              return (
                <Button
                  key={option.value}
                  ref={(el) => {
                    buttonRefs.current[index] = el as HTMLButtonElement | HTMLAnchorElement | null
                    if (isSelected) {
                      selectedButtonRef.current = el as HTMLButtonElement | HTMLAnchorElement | null
                    }
                  }}
                  data-selected={isSelected ? "true" : "false"}
                  variant="ghost"
                  type="button"
                  tabIndex={isFocused ? 0 : -1}
                  className={cn(
                    "w-full justify-center text-sm font-normal whitespace-nowrap",
                    isSelected && "bg-accent text-accent-foreground",
                    isFocused && !isSelected && "bg-accent/50",
                    option.disabled && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (!option.disabled) {
                      handleChange(option.value)
                    }
                  }}
                  onFocus={() => setFocusedIndex(index)}
                  disabled={option.disabled}
                >
                  {option.label}
                </Button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </span>
  )
}

export { Calendar, CalendarDayButton }
export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}
