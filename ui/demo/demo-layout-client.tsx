"use client"

import * as React from "react"
import { DemoSidebar } from "@/ui/demo/components/demo-sidebar"
import { Button } from "@/ui/shared/components/button"
import { Content } from "@/ui/shared/components/content"
import { Menu, PanelLeft } from "lucide-react"
import { ThemeToggle } from "@/ui/shared/components/theme-toggle"

interface DemoLayoutClientProps {
  children: React.ReactNode
  initialCollapsed?: boolean
}

export function DemoLayoutClient({ children, initialCollapsed = false }: DemoLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(initialCollapsed)

  return (
    <div className="flex h-screen overflow-hidden bg-background relative">
      <DemoSidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        onProfileClick={() => setSidebarOpen(false)}
        onSettingsClick={() => setSidebarOpen(false)}
        onLogoutClick={() => setSidebarOpen(false)}
      />
      {/* Mobile navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 border-b glass-navbar">
        <div className="flex justify-between items-center h-16 px-4 gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <ThemeToggle mode="cycle" />
        </div>
      </div>
      {/* Collapse button - desktop only */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 z-50 hidden lg:flex bg-background border border-border shadow-sm hover:bg-accent ml-2 transition-all duration-150 ease-in-out"
        style={{
          left: sidebarCollapsed ? "69px" : "256px",
        }}
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        aria-label="Toggle sidebar"
      >
        <PanelLeft className="h-5 w-5" />
      </Button>
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-background pt-16 lg:pt-0">
          <Content
            className="mx-auto"
            maxWidth="max-w-7xl"
            padding="px-4 md:px-8 lg:px-12 py-8 md:py-16 lg:py-24"
          >
            {children}
          </Content>
        </main>
      </div>
    </div>
  )
}
