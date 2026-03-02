import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "../utils/utils"
import { Button, type ButtonProps } from "./button"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
  )
)
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn("", className)} {...props} />
)
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
  disabled?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  disabled,
  size = "icon",
  ...props
}: PaginationLinkProps) => {
  const isDisabled = disabled || props["aria-disabled"] === "true"
  // Active page should be disabled but maintain its styling
  const shouldBeDisabled = isDisabled || isActive
  // Only apply disabled visual styling when disabled (not when just active)
  const shouldShowDisabledStyling = isDisabled && !isActive
  // Remove from tab order when disabled or active
  const tabIndex = shouldBeDisabled ? -1 : undefined

  return (
    <a
      aria-current={isActive ? "page" : undefined}
      aria-disabled={shouldBeDisabled ? "true" : undefined}
      tabIndex={tabIndex}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-app-radius text-sm font-medium transition-[color,background-color,transform] duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
        shouldShowDisabledStyling && "pointer-events-none opacity-50 cursor-not-allowed",
        shouldBeDisabled && !shouldShowDisabledStyling && "pointer-events-none",
        !shouldBeDisabled && "cursor-pointer",
        isActive ? "bg-accent-brand text-background" : "hover:bg-accent hover:text-accent-foreground",
        size === "icon" ? "h-9 w-9" : "h-9 px-4",
        className
      )}
      onClick={(e) => {
        if (shouldBeDisabled) {
          e.preventDefault()
          return
        }
        props.onClick?.(e)
      }}
      {...props}
    />
  )
}
PaginationLink.displayName = "PaginationLink"

const PAGINATION_PREV_DEFAULT_LABEL = "Prev"
const PAGINATION_NEXT_DEFAULT_LABEL = "Next"

/* Subcomponents for PaginationPrevious (default: icon + label; label hidden on small screens) */
const PaginationPreviousIcon = ({ className, ...props }: React.ComponentProps<typeof ChevronLeft>) => (
  <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
)
PaginationPreviousIcon.displayName = "PaginationPrevious.Icon"

const PaginationPreviousLabel = ({
  children,
  className,
  ...props
}: React.ComponentProps<"span"> & { children?: React.ReactNode }) => (
  <span className={cn("hidden sm:inline", className)} {...props}>
    {children ?? PAGINATION_PREV_DEFAULT_LABEL}
  </span>
)
PaginationPreviousLabel.displayName = "PaginationPrevious.Label"

type PaginationPreviousProps = React.ComponentProps<typeof PaginationLink> & {
  /** Custom content. When provided, use subcomponents (e.g. Icon, Label) or your own. Omit for default icon + label. */
  children?: React.ReactNode
}

const PaginationPrevious = ({ className, children, ...props }: PaginationPreviousProps) => (
  <PaginationLink
    aria-label="Go to previous page"
    className={cn("min-h-9 min-w-9 gap-1 p-2.5 w-fit", className)}
    {...props}
  >
    {children !== undefined ? (
      children
    ) : (
      <>
        <PaginationPreviousIcon />
        <PaginationPreviousLabel />
      </>
    )}
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"
PaginationPrevious.Icon = PaginationPreviousIcon
PaginationPrevious.Label = PaginationPreviousLabel

/* Subcomponents for PaginationNext */
const PaginationNextIcon = ({ className, ...props }: React.ComponentProps<typeof ChevronRight>) => (
  <ChevronRight className={cn("h-4 w-4", className)} {...props} />
)
PaginationNextIcon.displayName = "PaginationNext.Icon"

const PaginationNextLabel = ({
  children,
  className,
  ...props
}: React.ComponentProps<"span"> & { children?: React.ReactNode }) => (
  <span className={cn("hidden sm:inline", className)} {...props}>
    {children ?? PAGINATION_NEXT_DEFAULT_LABEL}
  </span>
)
PaginationNextLabel.displayName = "PaginationNext.Label"

type PaginationNextProps = React.ComponentProps<typeof PaginationLink> & {
  /** Custom content. When provided, use subcomponents (e.g. Icon, Label) or your own. Omit for default icon + label. */
  children?: React.ReactNode
}

const PaginationNext = ({ className, children, ...props }: PaginationNextProps) => (
  <PaginationLink
    aria-label="Go to next page"
    className={cn("min-h-9 min-w-9 gap-1 p-2.5 w-fit", className)}
    {...props}
  >
    {children !== undefined ? (
      children
    ) : (
      <>
        <PaginationNextLabel />
        <PaginationNextIcon />
      </>
    )}
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"
PaginationNext.Icon = PaginationNextIcon
PaginationNext.Label = PaginationNextLabel

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
