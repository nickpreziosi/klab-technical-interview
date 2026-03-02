import * as React from "react"
import { Card } from "./card"
import { cn } from "../utils/utils"

export type DataCardVariant = "gradient" | "default"
export type DataCardTheme = "primary" | "success" | "warning" | "destructive" | "brand"

export interface DataCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The visual style variant of the card */
  variant?: DataCardVariant
  /** The color theme of the card */
  theme?: DataCardTheme
  /** Show a left border accent */
  showLeftBorder?: boolean
  /** Show a gradient background (when variant is "gradient") */
  showGradient?: boolean
  /** Additional CSS classes */
  className?: string
}

const themeClasses = {
  primary: {
    border: "border-border",
    leftBorder: "border-l-4 border-l-primary",
    gradient: "!bg-gradient-to-r from-primary/20 via-primary/10 to-transparent",
    text: "text-foreground",
    icon: "text-primary",
  },
  success: {
    border: "border-border",
    leftBorder: "border-l-4 border-l-success",
    gradient: "!bg-gradient-to-r from-success/20 via-success/10 to-transparent",
    text: "text-foreground",
    icon: "text-success",
  },
  warning: {
    border: "border-border",
    leftBorder: "border-l-4 border-l-warning",
    gradient: "!bg-gradient-to-r from-warning/20 via-warning/10 to-transparent",
    text: "text-foreground",
    icon: "text-warning",
  },
  destructive: {
    border: "border-border",
    leftBorder: "border-l-4 border-l-destructive",
    gradient: "!bg-gradient-to-r from-destructive/20 via-destructive/10 to-transparent",
    text: "text-foreground",
    icon: "text-destructive",
  },
  brand: {
    border: "border-border",
    leftBorder: "border-l-4 border-l-accent-brand",
    gradient: "!bg-gradient-to-r from-accent-brand/20 via-accent-brand/10 to-transparent",
    text: "text-foreground",
    icon: "text-accent-brand",
  },
}

const DataCardContext = React.createContext<{
  variant: DataCardVariant
  theme: DataCardTheme
}>({
  variant: "gradient",
  theme: "primary",
})

export const DataCard = React.forwardRef<HTMLDivElement, DataCardProps>(
  (
    {
      variant = "default",
      theme = "primary",
      showLeftBorder,
      showGradient,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const themeClass = themeClasses[theme]

    // Determine if gradient should be shown
    // If showGradient is explicitly set, use that, otherwise use variant === "gradient"
    const shouldShowGradient = showGradient !== undefined ? showGradient : variant === "gradient"

    // Determine if left border should be shown
    // If showLeftBorder is explicitly set, use that, otherwise default to false
    const shouldShowLeftBorder = showLeftBorder ?? false

    return (
      <DataCardContext.Provider value={{ variant, theme }}>
        <Card
          ref={ref}
          className={cn(
            themeClass.border,
            shouldShowLeftBorder && themeClass.leftBorder,
            shouldShowGradient && themeClass.gradient,
            shouldShowGradient && "relative",
            className
          )}
          {...props}
        >
          {children}
        </Card>
      </DataCardContext.Provider>
    )
  }
)
DataCard.displayName = "DataCard"

export interface DataCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional CSS classes */
  className?: string
}

export const DataCardContent = React.forwardRef<HTMLDivElement, DataCardContentProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("p-6 relative", className)} {...props} />
  }
)
DataCardContent.displayName = "DataCardContent"

export interface DataCardLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional CSS classes */
  className?: string
}

export const DataCardLabel = React.forwardRef<HTMLDivElement, DataCardLabelProps>(
  ({ className, children, ...props }, ref) => {
    const { theme } = React.useContext(DataCardContext)
    const themeClass = themeClasses[theme]

    return (
      <div
        ref={ref}
        className={cn(
          "text-sm text-muted-foreground mb-2 flex items-center gap-2",
          "[&>svg]:shrink-0",
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type && typeof child.type !== "string") {
            // Apply theme color to icon elements
            const childProps = child.props as { className?: string }
            return React.cloneElement(child as React.ReactElement<any>, {
              className: cn(themeClass.icon, childProps?.className),
            } as any)
          }
          return child
        })}
      </div>
    )
  }
)
DataCardLabel.displayName = "DataCardLabel"

export interface DataCardValueProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional CSS classes */
  className?: string
}

export const DataCardValue = React.forwardRef<HTMLDivElement, DataCardValueProps>(
  ({ className, ...props }, ref) => {
    const { theme } = React.useContext(DataCardContext)
    const themeClass = themeClasses[theme]

    return (
      <div
        ref={ref}
        className={cn("text-2xl font-bold tracking-tight", themeClass.text, className)}
        {...props}
      />
    )
  }
)
DataCardValue.displayName = "DataCardValue"

export interface DataCardDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional CSS classes */
  className?: string
}

export const DataCardDescription = React.forwardRef<HTMLDivElement, DataCardDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("text-sm text-muted-foreground mt-2", className)} {...props} />
    )
  }
)
DataCardDescription.displayName = "DataCardDescription"
