"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "../utils/utils"
import { Button } from "./button"
import { Calendar } from "@/ui/shared/components/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/shared/components/popover"
import { Label } from "@/ui/shared/components/label"
import { formatDate as formatDateIntl } from "../utils/date-formatter"

export interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  min?: Date
  max?: Date
  className?: string
  /** Optional id for the date picker button. If not provided, one will be generated. */
  id?: string
  mode?: "single" | "range" | "range-single"
  rangeStart?: Date
  rangeEnd?: Date
  onRangeChange?: (start: Date | undefined, end: Date | undefined) => void
  range?: DateRange
  onRangeSelect?: (range: DateRange | undefined) => void
  floatingLabel?: boolean
  /**
   * Locale string (e.g., "en-US", "es-ES"). When provided, uses Intl.DateTimeFormat for locale-aware formatting.
   * If `dateFormatOptions` is provided without `locale`, defaults to "en-US".
   * Use with `dateFormatOptions` to control formatting style.
   * Applies to all DatePicker modes (single, range, range-single).
   */
  locale?: string
  /**
   * Formatting options for Intl.DateTimeFormat. When provided, uses Intl.DateTimeFormat for formatting.
   * If `locale` is not provided, defaults to "en-US".
   * Common options: `{ dateStyle: "short" }`, `{ dateStyle: "long" }`, `{ dateStyle: "full" }`, etc.
   * Defaults to `{ dateStyle: "short" }` when locale or dateFormatOptions is provided.
   * Applies to all DatePicker modes (single, range, range-single).
   */
  dateFormatOptions?: Intl.DateTimeFormatOptions
  /**
   * Date format string (date-fns format pattern). Only used when neither `locale` nor `dateFormatOptions` is provided.
   * Defaults to "MM/dd/yyyy". Examples: "MMMM do, yyyy" for "December 29th, 2025"
   * Applies to all DatePicker modes (single, range, range-single).
   */
  format?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  label,
  disabled = false,
  min,
  max,
  className,
  id: providedId,
  mode = "single",
  rangeStart,
  rangeEnd,
  onRangeChange,
  range,
  onRangeSelect,
  floatingLabel = true,
  locale,
  dateFormatOptions,
  format: formatString = "MM/dd/yyyy",
}: DatePickerProps) {
  const [startOpen, setStartOpen] = React.useState(false)
  const [endOpen, setEndOpen] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const generatedId = React.useId()
  const labelId = providedId ?? generatedId
  const startLabelId = React.useId()
  const endLabelId = React.useId()

  const formatDate = (date: Date | undefined): string => {
    if (!date) return ""
    // Use Intl.DateTimeFormat when locale is provided OR when dateFormatOptions is provided
    if (locale || dateFormatOptions) {
      const effectiveLocale = locale || "en-US"
      return formatDateIntl(date, effectiveLocale, dateFormatOptions || { dateStyle: "short" })
    }
    return format(date, formatString)
  }

  const formatRange = (range: DateRange | undefined): string => {
    if (!range?.from) return ""
    if (!range.to) return formatDate(range.from)
    return `${formatDate(range.from)} - ${formatDate(range.to)}`
  }

  const isDateDisabled = (date: Date) => {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    if (min) {
      const minOnly = new Date(min.getFullYear(), min.getMonth(), min.getDate())
      if (dateOnly < minOnly) return true
    }

    if (max) {
      const maxOnly = new Date(max.getFullYear(), max.getMonth(), max.getDate())
      if (dateOnly > maxOnly) return true
    }

    return false
  }

  const isDateDisabledRange = (date: Date, isStart: boolean) => {
    if (isDateDisabled(date)) return true

    if (isStart && rangeEnd) {
      const endOnly = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate())
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      if (dateOnly > endOnly) return true
    }

    if (!isStart && rangeStart) {
      const startOnly = new Date(
        rangeStart.getFullYear(),
        rangeStart.getMonth(),
        rangeStart.getDate()
      )
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      if (dateOnly < startOnly) return true
    }

    return false
  }

  // Single calendar range mode
  if (mode === "range-single") {
    const hasValue = !!range?.from
    const isFloating = open || hasValue

    const labelClasses = cn(
      "rounded-app-radius floating-label-input-label absolute pointer-events-none z-10",
      "h-4 flex items-center",
      "transition-[top,transform,font-size,color,opacity,background-color,left]",
      "duration-200",
      open ? "bg-foreground" : isFloating ? "bg-border" : "bg-border/[0]",
      "px-2",
      open ? "text-background" : isFloating ? "text-foreground" : "text-input-placeholder",
      !isFloating && "opacity-80",
      isFloating
        ? "left-3 top-0 -translate-y-1/2 text-xs font-medium"
        : "left-[36px] top-1/2 -translate-y-1/2 text-base"
    )

    return (
      <div className={cn("relative w-full", className)}>
        {label && !floatingLabel && (
          <Label htmlFor={labelId} className="mb-2">
            {label}
          </Label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id={labelId}
              className={cn(
                "bg-transparent w-full justify-start text-left font-normal h-11 !py-0",
                floatingLabel && label && "pt-4 pb-0",
                "hover:bg-transparent hover:border-input active:scale-100",
                range
                  ? "hover:text-foreground"
                  : "text-input-placeholder hover:text-input-placeholder"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">
                {range ? formatRange(range) : !floatingLabel || !label ? placeholder : ""}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={range}
              onSelect={onRangeSelect}
              disabled={isDateDisabled}
              captionLayout="dropdown"
              defaultMonth={range?.from}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {label && floatingLabel && (
          <label
            htmlFor={labelId}
            className={labelClasses}
            style={
              {
                transitionTimingFunction: "cubic-bezier(0.65, -0.32, 0.38, 1.23)",
              } as React.CSSProperties
            }
          >
            {label}
          </label>
        )}
      </div>
    )
  }

  // Two separate calendars range mode
  if (mode === "range") {
    const startHasValue = !!rangeStart
    const startIsFloating = startOpen || startHasValue
    const endHasValue = !!rangeEnd
    const endIsFloating = endOpen || endHasValue

    const startLabelClasses = cn(
      "rounded-app-radius floating-label-input-label absolute pointer-events-none z-10",
      "h-4 flex items-center",
      "transition-[top,transform,font-size,color,opacity,background-color,left]",
      "duration-200",
      startOpen ? "bg-foreground" : startIsFloating ? "bg-border" : "bg-border/[0]",
      "px-2",
      startOpen ? "text-background" : startIsFloating ? "text-foreground" : "text-input-placeholder",
      !startIsFloating && "opacity-80",
      startIsFloating
        ? "left-3 top-0 -translate-y-1/2 text-xs font-medium"
        : "left-[36px] top-1/2 -translate-y-1/2 text-base"
    )

    const endLabelClasses = cn(
      "rounded-app-radius floating-label-input-label absolute pointer-events-none z-10",
      "h-4 flex items-center",
      "transition-[top,transform,font-size,color,opacity,background-color,left]",
      "duration-200",
      endOpen ? "bg-foreground" : endIsFloating ? "bg-border" : "bg-border/[0]",
      "px-2",
      endOpen ? "text-background" : endIsFloating ? "text-foreground" : "text-input-placeholder",
      !endIsFloating && "opacity-80",
      endIsFloating
        ? "left-3 top-0 -translate-y-1/2 text-xs font-medium"
        : "left-[36px] top-1/2 -translate-y-1/2 text-base"
    )

    return (
      <div
        className={cn("flex flex-col sm:flex-row items-stretch sm:items-center gap-4", className)}
      >
        {label && !floatingLabel && <Label className="mb-2 sm:mb-0">{label}</Label>}
        <div className="relative flex-1 min-w-0">
          {label && !floatingLabel && (
            <Label htmlFor={startLabelId} className="mb-2 text-xs text-input-placeholder">
              Start
            </Label>
          )}
          <Popover open={startOpen} onOpenChange={setStartOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id={startLabelId}
                className={cn(
                  "bg-transparent w-full justify-start text-left font-normal h-11 !py-0",
                  floatingLabel && label && "pt-4 pb-0",
                  "hover:bg-transparent hover:border-input active:scale-100",
                  rangeStart
                    ? "hover:text-foreground"
                    : "text-input-placeholder hover:text-input-placeholder"
                )}
                disabled={disabled}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span className="truncate">
                  {rangeStart
                    ? formatDate(rangeStart)
                    : !floatingLabel || !label
                      ? placeholder
                      : ""}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={rangeStart}
                onSelect={(date) => {
                  onRangeChange?.(date, rangeEnd)
                  setStartOpen(false)
                }}
                disabled={(date) => isDateDisabledRange(date, true)}
                captionLayout="dropdown"
                defaultMonth={rangeStart}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {label && floatingLabel && (
            <label
              htmlFor={startLabelId}
              className={startLabelClasses}
              style={
                {
                  transitionTimingFunction: "cubic-bezier(0.65, -0.32, 0.38, 1.23)",
                } as React.CSSProperties
              }
            >
              {label} (Start)
            </label>
          )}
        </div>
        <div className="relative flex-1 min-w-0">
          {label && !floatingLabel && (
            <Label htmlFor={endLabelId} className="mb-2 text-xs text-input-placeholder">
              End
            </Label>
          )}
          <Popover open={endOpen} onOpenChange={setEndOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id={endLabelId}
                className={cn(
                  "bg-transparent w-full justify-start text-left font-normal h-11 !py-0",
                  floatingLabel && label && "pt-4 pb-0",
                  "hover:bg-transparent hover:border-input active:scale-100",
                  rangeEnd
                    ? "hover:text-foreground"
                    : "text-input-placeholder hover:text-input-placeholder"
                )}
                disabled={disabled}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span className="truncate">
                  {rangeEnd ? formatDate(rangeEnd) : !floatingLabel || !label ? placeholder : ""}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={rangeEnd}
                onSelect={(date) => {
                  onRangeChange?.(rangeStart, date)
                  setEndOpen(false)
                }}
                disabled={(date) => isDateDisabledRange(date, false)}
                captionLayout="dropdown"
                defaultMonth={rangeEnd}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {label && floatingLabel && (
            <label
              htmlFor={endLabelId}
              className={endLabelClasses}
              style={
                {
                  transitionTimingFunction: "cubic-bezier(0.65, -0.32, 0.38, 1.23)",
                } as React.CSSProperties
              }
            >
              {label} (End)
            </label>
          )}
        </div>
      </div>
    )
  }

  const hasValue = !!value
  const isFloating = open || hasValue

  const labelClasses = cn(
    "rounded-app-radius floating-label-input-label absolute pointer-events-none z-10",
    "h-4 flex items-center",
    "transition-[top,transform,font-size,color,opacity,background-color,left]",
    "duration-200",
    open ? "bg-foreground" : isFloating ? "bg-border" : "bg-border/[0]",
    "px-2",
    open ? "text-background" : isFloating ? "text-foreground" : "text-input-placeholder",
    !isFloating && "opacity-80",
    isFloating
      ? "left-3 top-0 -translate-y-1/2 text-xs font-medium"
      : "left-[36px] top-1/2 -translate-y-1/2 text-base"
  )

  return (
    <div className={cn("relative w-full", className)}>
      {label && !floatingLabel && (
        <Label htmlFor={labelId} className="mb-2">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={labelId}
            className={cn(
              "bg-transparent w-full justify-start text-left font-normal h-11 !py-0",
              floatingLabel && label && "pt-4 pb-0",
              "hover:bg-transparent hover:border-input active:scale-100",
              value ? "hover:text-foreground" : "text-input-placeholder hover:text-input-placeholder"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {value ? formatDate(value) : !floatingLabel || !label ? placeholder : ""}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent id={labelId ? `${labelId}-content` : undefined} className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange?.(date)
              setOpen(false)
            }}
            disabled={isDateDisabled}
            captionLayout="dropdown"
            defaultMonth={value}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {label && floatingLabel && (
        <label
          htmlFor={labelId}
          className={labelClasses}
          style={
            {
              transitionTimingFunction: "cubic-bezier(0.65, -0.32, 0.38, 1.23)",
            } as React.CSSProperties
          }
        >
          {label}
        </label>
      )}
    </div>
  )
}
