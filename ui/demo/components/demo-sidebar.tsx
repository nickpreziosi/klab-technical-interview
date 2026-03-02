"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/ui/shared/utils/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarLogo,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
} from "@/ui/shared/components/sidebar"
import { Sheet, SheetContent, SheetTitle } from "@/ui/shared/components/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/shared/components/dropdown-menu"
import { Button } from "@/ui/shared/components/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/shared/components/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/shared/components/tooltip"
import { Separator } from "@/ui/shared/components/separator"
import { ThemeToggle } from "@/ui/shared/components/theme-toggle"
import { Receipt, ShoppingCart, Building2, User, Settings, LogOut } from "lucide-react"
import { KLabLogo } from "@/ui/shared/components/logos/k-lab-logo"

interface DemoSidebarProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  user?: {
    name?: string
    email?: string
    avatar?: string
  }
  onProfileClick?: () => void
  onSettingsClick?: () => void
  onLogoutClick?: () => void
  className?: string
}

const navigationLinks = [
  { href: "/", label: "Invoice Dashboard", icon: Receipt },
  { href: "#", label: "Buyer Config", icon: ShoppingCart },
  { href: "#", label: "Supplier Config", icon: Building2 },
]

function DemoSidebarContent({
  pathname,
  user,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  onOpenChange,
  collapsed,
}: {
  pathname: string
  user: { name?: string; email?: string; avatar?: string }
  onProfileClick?: () => void
  onSettingsClick?: () => void
  onLogoutClick?: () => void
  onOpenChange?: (open: boolean) => void
  collapsed: boolean
}) {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false)

  const NavigationContent = () => {
    if (collapsed) {
      return (
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <SidebarMenuItem key={`${link.href}-${link.label}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          size="icon"
                          className="h-9 w-9"
                          asChild
                        >
                          <Link
                            href={link.href}
                            onClick={() => onOpenChange?.(false)}
                            aria-label={link.label}
                          >
                            <Icon className="h-5 w-5" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{link.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )
    }

    return (
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {navigationLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <SidebarMenuItem key={`${link.href}-${link.label}`}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="md"
                    className="w-full justify-start gap-3"
                    asChild
                  >
                    <Link
                      href={link.href}
                      onClick={() => onOpenChange?.(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{link.label}</span>
                    </Link>
                  </Button>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  const ThemeContent = () => {
    if (collapsed) {
      return (
        <SidebarGroup>
          <SidebarGroupContent className="!my-0">
            <SidebarMenu>
              <SidebarMenuItem className="!my-0">
                <ThemeToggle mode="cycle" layout="sidebar" />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )
    }
    return (
      <SidebarGroup className="flex flex-row items-center">
        <SidebarGroupLabel>Theme:</SidebarGroupLabel>
        <SidebarGroupContent className="!my-0">
          <SidebarMenu>
            <SidebarMenuItem className="!my-0">
              <ThemeToggle mode="cycle" layout="sidebar" />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  const ProfileContent = () => {
    if (collapsed) {
      return (
        <DropdownMenu open={profileDropdownOpen} onOpenChange={setProfileDropdownOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-background"
                  aria-label="Account"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name ? getInitials(user.name) : "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Account</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="center" className="!w-56 !p-4 glass-morphism">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogoutClick}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <DropdownMenu open={profileDropdownOpen} onOpenChange={setProfileDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="md"
            className="w-full justify-start gap-3 h-auto py-3 hover:bg-accent"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name ? getInitials(user.name) : "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-left flex-1 min-w-0">
              <span className="text-sm font-medium truncate w-full">{user.name || "User"}</span>
              <span className="text-xs text-muted-foreground truncate w-full">
                {user.email || "user@example.com"}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="!w-64 lg:!w-56 !p-4 glass-morphism">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onProfileClick}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSettingsClick}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onLogoutClick}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarHeader className="!h-16 justify-start" showCollapseButton={false}>
        <Link
          href="/"
          className="flex w-full items-center justify-start"
          aria-label="K Lab"
        >
          <SidebarLogo
            className="flex w-full"
            logo={
              <div className="relative h-14 w-full overflow-hidden">
                <div
                  className={cn(
                    "relative flex items-center shrink-0 transition-all duration-200 ease-in-out",
                    collapsed
                      ? "min-w-9 h-14 ml-0 translate-x-0"
                      : "min-w-[127px] h-14 ml-[50%] -translate-x-1/2"
                  )}
                >
                  {/* Full logo - icon portion sized to match w-9 for alignment */}
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 flex items-center justify-start transition-opacity duration-200 ease-in-out",
                      collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
                    )}
                  >
                    <KLabLogo className="h-9 w-[127px] shrink-0" />
                  </div>
                  {/* Icon - same position as left portion of full logo */}
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 flex items-center justify-start transition-opacity duration-200 ease-in-out",
                      collapsed ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}
                  >
                    <KLabLogo variant="icon" className="w-9 h-9 shrink-0" />
                  </div>
                </div>
              </div>
            }
            alt="K Lab"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {NavigationContent()}
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator className="my-2" />
        {ThemeContent()}
      </SidebarContent>
      <SidebarFooter>{ProfileContent()}</SidebarFooter>
    </TooltipProvider>
  )
}

export function DemoSidebar({
  open,
  onOpenChange,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: undefined,
  },
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  className,
}: DemoSidebarProps) {
  const pathname = usePathname()
  const [internalOpen, setInternalOpen] = React.useState(open)

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      setInternalOpen(newOpen)
      onOpenChange?.(newOpen)
    },
    [onOpenChange]
  )

  React.useEffect(() => {
    if (open !== undefined) {
      setInternalOpen(open)
    }
  }, [open])

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && internalOpen) {
        handleOpenChange(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [internalOpen, handleOpenChange])

  const sidebarContent = (
    <DemoSidebarContent
      pathname={pathname}
      user={user}
      onProfileClick={onProfileClick}
      onSettingsClick={onSettingsClick}
      onLogoutClick={onLogoutClick}
      onOpenChange={handleOpenChange}
      collapsed={controlledCollapsed ?? false}
    />
  )

  return (
    <>
      <div className={cn("hidden lg:block shrink-0", className)}>
        <Sidebar
          collapsible="icon"
          collapsed={controlledCollapsed ?? false}
          onCollapsedChange={onCollapsedChange}
        >
          {sidebarContent}
        </Sidebar>
      </div>
      <Sheet open={internalOpen} onOpenChange={handleOpenChange}>
        <SheetContent side="left" className="w-72 p-0 lg:hidden">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="flex flex-col h-full">
            <Sidebar className="w-full">
              <DemoSidebarContent
                pathname={pathname}
                user={user}
                onProfileClick={onProfileClick}
                onSettingsClick={onSettingsClick}
                onLogoutClick={onLogoutClick}
                onOpenChange={handleOpenChange}
                collapsed={false}
              />
            </Sidebar>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
