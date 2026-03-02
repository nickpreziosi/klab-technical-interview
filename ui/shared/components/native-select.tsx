"use client"

import * as React from "react"

import { cn } from "../utils/utils"
import { Label } from "./label"

export interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Optional label text. When provided, renders a Label component above the select. */
  label?: string
}

const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, children, label, id: providedId, ...props }, ref) => {
    const generatedId = React.useId()
    const selectId = providedId ?? generatedId

    const select = (
      <select
        id={selectId}
        data-native-select="true"
        className={cn(
          "flex h-9 w-full rounded-app-radius border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-[background-color,border-color] duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-input-placeholder disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )

    // Only wrap with label container if label is provided
    if (label) {
      return (
        <div className={cn("space-y-2", className)}>
          <Label htmlFor={selectId} className="mb-2">
            {label}
          </Label>
          {select}
        </div>
      )
    }

    return select
  }
)
NativeSelect.displayName = "NativeSelect"

export { NativeSelect }
