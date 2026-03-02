/**
 * Date formatting utilities using Intl.DateTimeFormat
 * Formats dates based on language and locale
 */

export interface DateFormatterOptions extends Intl.DateTimeFormatOptions {
  /** Custom locale override (defaults to using current language) */
  locale?: string | string[]
}

/**
 * Format a date using the current language/locale
 *
 * @param date - Date to format (Date object, timestamp, or date string)
 * @param language - Language code (e.g., "en", "es", "pt")
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 *
 * @example
 * ```tsx
 * formatDate(new Date(), "en", { dateStyle: "full" })
 * // "Monday, January 1, 2024"
 *
 * formatDate(new Date(), "es", { dateStyle: "long" })
 * // "1 de enero de 2024"
 * ```
 */
export function formatDate(
  date: Date | number | string,
  languageOrLocale: string,
  options?: DateFormatterOptions
): string {
  const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date
  // Use explicit locale from options if provided, otherwise use the languageOrLocale parameter
  const locale = options?.locale || languageOrLocale

  const formatter = new Intl.DateTimeFormat(locale, {
    ...options,
  })

  return formatter.format(dateObj)
}

/**
 * Format a date with time using the current language/locale
 *
 * @param date - Date to format
 * @param language - Language code
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date and time string
 *
 * @example
 * ```tsx
 * formatDateTime(new Date(), "en", {
 *   dateStyle: "short",
 *   timeStyle: "short"
 * })
 * // "1/1/24, 12:00 PM"
 * ```
 */
export function formatDateTime(
  date: Date | number | string,
  language: string,
  options?: DateFormatterOptions
): string {
  return formatDate(date, language, {
    dateStyle: "short",
    timeStyle: "short",
    ...options,
  })
}

/**
 * Format only the time portion of a date
 *
 * @param date - Date to format
 * @param language - Language code
 * @param options - Intl.DateTimeFormat options for time
 * @returns Formatted time string
 *
 * @example
 * ```tsx
 * formatTime(new Date(), "en", { timeStyle: "medium" })
 * // "12:00:00 PM"
 * ```
 */
export function formatTime(
  date: Date | number | string,
  language: string,
  options?: DateFormatterOptions
): string {
  return formatDate(date, language, {
    timeStyle: "medium",
    ...options,
  })
}

/**
 * Format a date relative to now (e.g., "2 days ago", "in 3 hours")
 *
 * @param date - Date to format
 * @param language - Language code
 * @param options - Intl.RelativeTimeFormat options
 * @returns Relative date string
 *
 * @example
 * ```tsx
 * formatRelativeDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), "en")
 * // "2 days ago"
 * ```
 */
export function formatRelativeDate(
  date: Date | number | string,
  language: string,
  options?: Intl.RelativeTimeFormatOptions
): string {
  const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((dateObj.getTime() - now.getTime()) / 1000)

  const rtf = new Intl.RelativeTimeFormat(language, {
    numeric: "auto",
    ...options,
  })

  const intervals = [
    { unit: "year" as const, seconds: 31536000 },
    { unit: "month" as const, seconds: 2592000 },
    { unit: "week" as const, seconds: 604800 },
    { unit: "day" as const, seconds: 86400 },
    { unit: "hour" as const, seconds: 3600 },
    { unit: "minute" as const, seconds: 60 },
    { unit: "second" as const, seconds: 1 },
  ]

  for (const { unit, seconds } of intervals) {
    const interval = Math.floor(Math.abs(diffInSeconds) / seconds)
    if (interval >= 1) {
      return rtf.format(diffInSeconds < 0 ? -interval : interval, unit)
    }
  }

  return rtf.format(0, "second")
}

/**
 * Format a date range
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @param language - Language code
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date range string
 *
 * @example
 * ```tsx
 * formatDateRange(startDate, endDate, "en", { dateStyle: "long" })
 * // "January 1 – 5, 2024"
 * ```
 */
export function formatDateRange(
  startDate: Date | number | string,
  endDate: Date | number | string,
  language: string,
  options?: DateFormatterOptions
): string {
  const start =
    typeof startDate === "string" || typeof startDate === "number" ? new Date(startDate) : startDate
  const end =
    typeof endDate === "string" || typeof endDate === "number" ? new Date(endDate) : endDate
  const locale = options?.locale || language

  const formatter = new Intl.DateTimeFormat(locale, {
    ...options,
  })

  // Use formatRange if available (modern browsers)
  if (typeof formatter.formatRange === "function") {
    return formatter.formatRange(start, end)
  }

  // Fallback for older browsers
  const startStr = formatter.format(start)
  const endStr = formatter.format(end)
  return `${startStr} – ${endStr}`
}
