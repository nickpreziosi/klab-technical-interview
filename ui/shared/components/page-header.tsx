"use client"

import * as React from "react"
import { cn } from "@/ui/shared/utils/utils"

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Page title */
  title: React.ReactNode
  /** Optional subtitle/description below the title */
  subtitle?: React.ReactNode
  /** Icon displayed to the left of the title (e.g. Lucide icon) */
  icon?: React.ReactNode
  /** Optional action(s) aligned to the right (e.g. primary button) */
  actions?: React.ReactNode
}

/**
 * Page header with icon, title, and optional subtitle.
 * Mirrors the Dash PageHeader: icon + title on first row, subtitle on second, with bottom border.
 */
export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, subtitle, icon, actions, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mb-8 pb-6 border-b border-border",
          actions && "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4",
          className
        )}
        {...props}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 mb-2">
            {icon && (
              <span className="flex-shrink-0 [&>svg]:size-8 [&>*]:!text-foreground">
                {icon}
              </span>
            )}
            <h1 className="text-2xl font-bold leading-tight text-foreground m-0 truncate">
              {title}
            </h1>
          </div>
          {subtitle != null && (
            <div className="text-base text-muted-foreground leading-normal max-w-[800px] m-0">
              {subtitle}
            </div>
          )}
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
    )
  }
)
PageHeader.displayName = "PageHeader"
