"use client"

import * as React from "react"
import { cn } from "../utils/utils"
import { Button } from "./button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Sidebar Context
interface SidebarContextValue {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  collapsible: boolean | "icon"
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined)

function useSidebarContext() {
  const context = React.useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("Sidebar components must be used within a Sidebar component")
  }
  return context
}

// Main Sidebar Component
export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsible?: boolean | "icon"
  defaultCollapsed?: boolean
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      className,
      collapsible = false,
      defaultCollapsed = false,
      collapsed: controlledCollapsed,
      onCollapsedChange,
      children,
      ...props
    },
    ref
  ) => {
    const [internalCollapsed, setInternalCollapsed] = React.useState(defaultCollapsed)

    // Use controlled collapsed if provided, otherwise use internal state
    const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed

    // Sync internal state when controlled collapsed changes
    React.useEffect(() => {
      if (controlledCollapsed !== undefined) {
        setInternalCollapsed(controlledCollapsed)
      }
    }, [controlledCollapsed])

    const handleCollapse = React.useCallback(
      (collapsed: boolean) => {
        if (controlledCollapsed === undefined) {
          setInternalCollapsed(collapsed)
        }
        onCollapsedChange?.(collapsed)
      },
      [onCollapsedChange, controlledCollapsed]
    )

    const contextValue = React.useMemo<SidebarContextValue>(
      () => ({
        isCollapsed,
        setIsCollapsed: handleCollapse,
        collapsible: collapsible || false,
      }),
      [isCollapsed, handleCollapse, collapsible]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <aside
          ref={ref}
          className={cn(
            "flex flex-col h-full bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border transition-all duration-150 ease-in-out shadow-sm",
            !isCollapsed && "overflow-hidden",
            collapsible === "icon" && isCollapsed && "w-[69px] overflow-x-visible overflow-y-auto",
            collapsible === true && isCollapsed && "w-0",
            !isCollapsed && "w-64",
            className
          )}
          data-collapsed={isCollapsed}
          data-collapsible={collapsible}
          {...props}
        >
          {children}
        </aside>
      </SidebarContext.Provider>
    )
  }
)
Sidebar.displayName = "Sidebar"

// Sidebar Header
export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  showCollapseButton?: boolean
}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, style, children, showCollapseButton, ...props }, ref) => {
    const { isCollapsed, collapsible } = useSidebarContext()

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between border-b border-sidebar-border p-4 transition-all duration-150 ease-in-out",
          className
        )}
        style={style}
        {...props}
      >
        {/* Single wrapper so header content (e.g. logo) stays mounted and CSS transitions can run when isCollapsed changes */}
        <div
          className={cn(
            "flex items-center w-full overflow-visible",
            isCollapsed && collapsible ? "justify-start" : "flex-1"
          )}
        >
          {children}
        </div>
        {collapsible && showCollapseButton !== false && <SidebarCollapseButton />}
      </div>
    )
  }
)
SidebarHeader.displayName = "SidebarHeader"

// Sidebar Logo Component
export interface SidebarLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @deprecated Use `logo` prop with a Logo component instead */
  src?: string
  alt?: string
  /** React element to render as logo (e.g., <KLabLogo />) */
  logo?: React.ReactNode
  children?: React.ReactNode
  mounted?: boolean
}

const SidebarLogo = React.forwardRef<HTMLDivElement, SidebarLogoProps>(
  ({ className, style, src, alt, logo, children, mounted = true, ...props }, ref) => {
    const { isCollapsed } = useSidebarContext()

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2", className)}
        style={style}
        suppressHydrationWarning
        {...props}
      >
        {logo && mounted && (
          <div className="min-w-9 min-h-9 flex-1 flex items-center justify-center overflow-visible shrink-0" suppressHydrationWarning>
            {logo}
          </div>
        )}
        {!logo && src && mounted && (
          <img
            src={src}
            alt={alt || "Logo"}
            className="rounded-app-radius w-9 h-9 object-contain"
            suppressHydrationWarning
          />
        )}
        {!isCollapsed && children && (
          <div className="flex-1" suppressHydrationWarning>
            {children}
          </div>
        )}
      </div>
    )
  }
)
SidebarLogo.displayName = "SidebarLogo"

// Sidebar Collapse Button
const SidebarCollapseButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed, setIsCollapsed, collapsible } = useSidebarContext()

  if (!collapsible) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={ref}
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", className)}
            onClick={() => setIsCollapsed(!isCollapsed)}
            {...props}
          >
            <span className="transition-transform duration-150 ease-in-out">
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </span>
            <span className="sr-only">{isCollapsed ? "Expand" : "Collapse"} sidebar</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{isCollapsed ? "Expand" : "Collapse"} sidebar</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
})
SidebarCollapseButton.displayName = "SidebarCollapseButton"

// Sidebar Content
export type SidebarContentProps = React.HTMLAttributes<HTMLDivElement>

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex-1 overflow-y-auto overflow-x-hidden p-4 scrollbar-hide", className)}
        style={style}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SidebarContent.displayName = "SidebarContent"

// Sidebar Group
const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} style={style} {...props}>
        {children}
      </div>
    )
  }
)
SidebarGroup.displayName = "SidebarGroup"

// Sidebar Group Label
const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, children, ...props }, ref) => {
    const { isCollapsed } = useSidebarContext()

    if (isCollapsed) return null

    return (
      <div
        ref={ref}
        className={cn(
          "px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
          className
        )}
        style={style}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

// Sidebar Group Content
const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-1", className)} style={style} {...props}>
        {children}
      </div>
    )
  }
)
SidebarGroupContent.displayName = "SidebarGroupContent"

// Sidebar Menu
const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, style, children, ...props }, ref) => {
    return (
      <ul ref={ref} className={cn("space-y-1", className)} style={style} {...props}>
        {children}
      </ul>
    )
  }
)
SidebarMenu.displayName = "SidebarMenu"

// Sidebar Menu Item
const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, style, children, ...props }, ref) => {
    return (
      <li ref={ref} className={cn("", className)} style={style} {...props}>
        {children}
      </li>
    )
  }
)
SidebarMenuItem.displayName = "SidebarMenuItem"

// Sidebar Menu Button
export interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  tooltip?: string
  active?: boolean
}

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, style, asChild = false, tooltip, active, children, ...props }, ref) => {
    const { isCollapsed } = useSidebarContext()

    const buttonClasses = cn(
      "glass-item-overlay w-full justify-start gap-3",
      isCollapsed && "justify-center px-2",
      active && "bg-sidebar-accent text-sidebar-accent-foreground",
      className
    )

    let buttonContent: React.ReactNode

    if (asChild && React.isValidElement(children)) {
      // Extract variant from props to avoid conflicts, we'll set it explicitly
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { variant, ...restProps } = props as React.ButtonHTMLAttributes<HTMLButtonElement> & {
        variant?: string
      }
      const childProps = children.props as React.ButtonHTMLAttributes<HTMLButtonElement> & {
        variant?: string
      }
      buttonContent = React.cloneElement(
        children as React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>,
        {
          ...restProps,
          className: cn(buttonClasses, childProps?.className),
          style: { ...style, ...childProps?.style },
          variant: active ? "secondary" : "ghost",
        } as React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }
      )
    } else {
      buttonContent = (
        <Button
          ref={ref}
          variant={active ? "secondary" : "ghost"}
          className={buttonClasses}
          style={style}
          {...props}
        >
          {children}
        </Button>
      )
    }

    if (isCollapsed && tooltip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
            <TooltipContent side="right">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return <>{buttonContent}</>
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

// Sidebar Footer
const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("border-t border-sidebar-border p-4", className)}
        style={style}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SidebarFooter.displayName = "SidebarFooter"

// Export hook
export function useSidebar() {
  const context = React.useContext(SidebarContext)
  return context
}

export {
  Sidebar,
  SidebarHeader,
  SidebarLogo,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebarContext,
}

export type SidebarGroupProps = React.HTMLAttributes<HTMLDivElement>
export type SidebarGroupLabelProps = React.HTMLAttributes<HTMLDivElement>
export type SidebarGroupContentProps = React.HTMLAttributes<HTMLDivElement>
export type SidebarMenuProps = React.HTMLAttributes<HTMLUListElement>
export type SidebarMenuItemProps = React.HTMLAttributes<HTMLLIElement>
export type SidebarFooterProps = React.HTMLAttributes<HTMLDivElement>
