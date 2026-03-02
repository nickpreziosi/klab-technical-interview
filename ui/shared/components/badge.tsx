import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-app-radius border px-2.5 py-0.5 text-xs font-semibold transition-[background-color,border-color] duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        success: "border-transparent bg-success text-success-foreground",
        warning: "border-transparent bg-warning text-warning-foreground",
        outline: "text-foreground",
        "accent-brand": "border-transparent bg-accent-brand text-white",
        "accent-brand-outline": "border-accent-brand text-accent-brand bg-transparent",
        "success-soft": "bg-success/20 text-success border-success",
        "warning-soft": "bg-warning/20 text-warning border-warning",
        "destructive-soft": "bg-destructive/20 text-destructive border-destructive",
        "primary-soft": "bg-foreground/20 text-foreground border-foreground",
        "accent-brand-soft": "bg-accent-brand/20 text-accent-brand border-accent-brand",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, style, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} style={style} {...props} />
}

export { Badge, badgeVariants }
