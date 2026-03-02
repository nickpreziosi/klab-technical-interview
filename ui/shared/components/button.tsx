import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/ui/shared/utils/utils"
import { Spinner } from "./spinner"

// Conditionally import Next.js Link - falls back to null if Next.js is not available
// This allows the Button component to work in Next.js, Astro, and plain React projects
type NextLinkType = React.ForwardRefExoticComponent<
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
  } & React.RefAttributes<HTMLAnchorElement>
>

let NextLink: NextLinkType | null = null

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nextLinkModule = require("next/link")
  NextLink = nextLinkModule.default || nextLinkModule
} catch {
  // Next.js is not available - this is fine, we'll use regular anchor tags
  // This allows the library to work in Astro, plain React, and other frameworks
  NextLink = null
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-app-radius text-sm font-medium transition-all duration-150 ease-in-out active:scale-95 disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background hover:bg-foreground/70",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline hover:text-accent-brand",
        "accent-brand": "bg-accent-brand text-black hover:opacity-90",
        "accent-brand-outline":
          "border border-accent-brand bg-transparent text-accent-brand hover:bg-accent-brand/20",
        "destructive-outline":
          "border border-destructive bg-transparent text-destructive hover:bg-destructive/10",
      },
      size: {
        sm: "h-8 rounded-app-radius px-3 text-xs",
        md: "h-9 px-4 py-2",
        lg: "h-10 rounded-app-radius px-8",
        xl: "h-11 rounded-app-radius px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /** Icon element to display */
  icon?: React.ReactNode
  /** Position of the icon relative to the text */
  iconPosition?: "left" | "right"
  /** If provided, renders as an anchor tag instead of button */
  href?: string
  /** Button type (only applies when href is not provided) */
  type?: "button" | "submit" | "reset"
  /** Icon size - defaults to size-4 for md, size-3 for sm, size-5 for lg, size-5 for xl */
  iconSize?: string
  /** Loading state - shows spinner and disables button */
  loading?: boolean
  /** Anchor-specific attributes (used when href is provided) */
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>["target"]
  rel?: React.AnchorHTMLAttributes<HTMLAnchorElement>["rel"]
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      icon,
      iconPosition = "left",
      href,
      type = "button",
      iconSize,
      loading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Map icon size strings to direct size classes (applied to SVG element itself)
    const iconSizeClassMap: Record<string, string> = {
      "size-2": "size-2",
      "size-3": "size-3",
      "size-4": "size-4",
      "size-5": "size-5",
      "size-6": "size-6",
      "size-7": "size-7",
      "size-8": "size-8",
    }

    // Determine icon size class to apply directly to SVG
    let svgSizeClass = ""
    if (iconSize && iconSizeClassMap[iconSize]) {
      svgSizeClass = iconSizeClassMap[iconSize]
    } else {
      // Default based on button size
      svgSizeClass =
        size === "sm"
          ? "size-3"
          : size === "lg" || size === "xl"
            ? "size-5"
            : size === "icon"
              ? "size-4"
              : "size-4"
    }

    // Helper function to process icon and apply size class
    const processIcon = (iconNode: React.ReactNode): React.ReactNode => {
      if (React.isValidElement(iconNode)) {
        const iconProps = iconNode.props as Record<string, unknown> & {
          className?: string
          width?: unknown
          height?: unknown
        }
        // Remove width and height by destructuring them out
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { width: _width, height: _height, ...restProps } = iconProps
        const clonedProps = {
          ...restProps,
          className: cn(svgSizeClass, iconProps.className),
        }
        return React.cloneElement(
          iconNode as React.ReactElement<Record<string, unknown>>,
          clonedProps
        )
      }
      return iconNode
    }

    // Clone icon and remove width/height attributes, apply size class directly to SVG
    const iconElement = icon ? (
      <span className="inline-flex items-center">{processIcon(icon)}</span>
    ) : null

    // Process children to find and size any SVG icons
    // When asChild is true, children is the child element itself, not content to process
    // React.Fragment cannot receive className - skip processIcon and recurse into its children
    const processChild = (child: React.ReactNode): React.ReactNode => {
      if (!React.isValidElement(child)) return child
      if (child.type === React.Fragment) {
        return (
          <>
            {React.Children.map(
              (child.props as { children?: React.ReactNode }).children,
              processChild
            )}
          </>
        )
      }
      const childProps = child.props as Record<string, unknown> & { children?: React.ReactNode }
      if (child.type && typeof child.type !== "string") {
        return processIcon(child)
      }
      if (childProps?.children && React.isValidElement(childProps.children)) {
        return React.cloneElement(
          child as React.ReactElement<Record<string, unknown>>,
          {
            ...childProps,
            children: processIcon(childProps.children),
          } as Record<string, unknown>
        )
      }
      return child
    }

    const processedChildren = asChild ? children : React.Children.map(children, processChild)

    const isDisabled = disabled || loading

    const content = (
      <>
        {loading && <Spinner size="sm" className="mr-2" />}
        {iconPosition === "left" && iconElement}
        {processedChildren}
        {iconPosition === "right" && iconElement}
      </>
    )

    const buttonClassName = cn(buttonVariants({ variant, size, className }))

    if (href) {
      // Extract type from props since it's not valid for Link or anchor
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { type: _type, ...linkProps } = props as React.AnchorHTMLAttributes<HTMLAnchorElement>

      // Use regular anchor tag for external links (target="_blank") or when asChild is true
      // Otherwise use Next.js Link for internal navigation
      const isExternalLink = linkProps.target === "_blank" || href.startsWith("http")

      if (asChild) {
        return (
          <Slot
            href={href}
            className={buttonClassName}
            ref={ref as React.Ref<HTMLAnchorElement>}
            {...linkProps}
          >
            {content}
          </Slot>
        )
      }

      if (isExternalLink) {
        return (
          <a
            href={href}
            className={buttonClassName}
            ref={ref as React.Ref<HTMLAnchorElement>}
            {...linkProps}
          >
            {content}
          </a>
        )
      }

      // Use Next.js Link if available, otherwise fall back to regular anchor tag
      if (NextLink) {
        return (
          <NextLink
            href={href}
            className={buttonClassName}
            ref={ref as React.Ref<HTMLAnchorElement>}
            {...linkProps}
          >
            {content}
          </NextLink>
        )
      }

      // Fallback to regular anchor tag when Next.js is not available (e.g., in Astro, plain React)
      return (
        <a
          href={href}
          className={buttonClassName}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...linkProps}
        >
          {content}
        </a>
      )
    }

    const Comp = asChild ? Slot : "button"
    // Extract type from props when using asChild since Fragment doesn't accept type
    const { type: buttonType, ...buttonProps } =
      props as React.ButtonHTMLAttributes<HTMLButtonElement>

    // When asChild is true, Slot merges props with its child
    // We need to clone the child and add className to it
    // We preserve the child's original children and just add icon/loading around them
    // This prevents Slot from trying to merge props with a Fragment
    if (asChild) {
      if (React.isValidElement(children) && React.Children.count(children) === 1) {
        const child = children as React.ReactElement<
          Record<string, unknown> & { className?: string; children?: React.ReactNode }
        >
        // React.Fragment can only have key, ref, and children - it cannot accept className
        // Wrap Fragment children in a span so we have an element that can receive props
        const isFragment = child.type === React.Fragment
        const childChildren = child.props?.children

        // Process the child's children for icons if needed
        const processedChildChildren = React.Children.map(childChildren, (childItem) => {
          if (React.isValidElement(childItem)) {
            return processIcon(childItem)
          }
          return childItem
        })

        // Build the children content - preserve child's children, add icon/loading around them
        const finalChildren = (
          <>
            {loading && <Spinner size="sm" className="mr-2" />}
            {iconPosition === "left" && iconElement}
            {processedChildChildren || childChildren}
            {iconPosition === "right" && iconElement}
          </>
        )

        const slotChild = isFragment ? (
          <span
            className={buttonClassName}
            ref={ref as React.Ref<HTMLSpanElement>}
            aria-disabled={isDisabled}
            role="button"
          >
            {finalChildren}
          </span>
        ) : (
          React.cloneElement(child, {
            className: cn(buttonClassName, child.props?.className),
            children: finalChildren,
            disabled: isDisabled,
          } as Record<string, unknown>)
        )

        return <Slot {...(buttonProps as Record<string, unknown>)}>{slotChild}</Slot>
      }
      // Fallback: if children is not a single valid element, render as normal button
      return (
        <button
          type={buttonType || type}
          className={buttonClassName}
          ref={ref as React.Ref<HTMLButtonElement>}
          disabled={isDisabled}
          {...buttonProps}
        >
          {content}
        </button>
      )
    }

    return (
      <Comp
        type={buttonType || type}
        className={buttonClassName}
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={isDisabled}
        {...buttonProps}
      >
        {content}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
