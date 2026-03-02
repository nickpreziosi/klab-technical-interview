"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../utils/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-app-radius text-sm font-medium transition-[color,background-color,transform] duration-150 hover:bg-muted active:scale-95 [touch-action:manipulation] disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed cursor-pointer [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent data-[state=on]:bg-foreground data-[state=on]:text-background",
        brand: "data-[state=on]:bg-accent-brand data-[state=on]:text-white",
        outline: "border border-input bg-transparent shadow-sm hover:bg-accent",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, style, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size }), className)}
    style={style}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
