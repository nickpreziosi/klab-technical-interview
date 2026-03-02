"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "../utils/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, style, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    style={style}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    /** Icon element to display. Defaults to ChevronDown if not provided. */
    icon?: React.ReactNode
  }
>(({ className, style, children, icon, ...props }, ref) => {
  // Process icon: if provided and is a React element, clone it with proper classes
  // Otherwise use default ChevronDown icon
  let iconElement: React.ReactNode
  if (icon !== undefined) {
    if (React.isValidElement(icon)) {
      const iconProps = icon.props as Record<string, unknown> & {
        className?: string
      }
      iconElement = React.cloneElement(
        icon as React.ReactElement<Record<string, unknown>>,
        {
          ...iconProps,
          className: cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-in-out",
            iconProps.className
          ),
        }
      )
    } else {
      iconElement = icon
    }
  } else {
    iconElement = (
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-in-out" />
    )
  }

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-[text-decoration] duration-150 hover:underline [&[data-state=open]>svg]:rotate-180 cursor-pointer",
          className
        )}
        style={style}
        {...props}
      >
        {children}
        {iconElement}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
})
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, style, children, ...props }, ref) => {
  const isThemeChanging =
    typeof document !== "undefined" &&
    document.documentElement.hasAttribute("data-theme-changing")

  return (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm",
      !isThemeChanging && "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    )}
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)} style={{ boxShadow: "none", ...style }}>
      {children}
    </div>
  </AccordionPrimitive.Content>
  )
})

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
