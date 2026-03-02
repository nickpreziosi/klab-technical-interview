"use client"

import * as React from "react"
import { cn } from "../utils/utils"

export interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum width as Tailwind class (e.g., "max-w-4xl", "max-w-screen-xl") */
  maxWidth?: string
  /** Padding as Tailwind classes (e.g., "p-4", "px-6 py-4", "p-4 md:p-8 lg:p-12"). For container queries, use @ prefix (e.g., "p-2 @md:p-4 @lg:p-6") */
  padding?: string
  /** Margin as Tailwind classes (e.g., "m-4", "mx-auto my-6", "my-4 md:my-8"). For container queries, use @ prefix (e.g., "my-2 @md:my-4") */
  margin?: string
}

/**
 * A flexible container component for standardizing content layout with consistent spacing and max width.
 * Perfect for constraining content width, applying responsive padding/margins, and maintaining design system consistency.
 */
export const Content = React.forwardRef<HTMLDivElement, ContentProps>(
  ({ className, maxWidth, padding, margin, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(maxWidth, padding, margin, className)}
        {...props}
      />
    )
  }
)

Content.displayName = "Content"

