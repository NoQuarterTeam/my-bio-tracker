import type React from "react"
import { cn } from "@/lib/utils"

interface DashboardShellProps {
  children: React.ReactNode
  className?: string
}

export function DashboardShell({ children, className }: DashboardShellProps) {
  return (
    <div className="flex-1 items-start md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
        <div className="py-6 pr-6 lg:py-8">
          <nav className="grid items-start px-4 text-sm font-medium">
            <a
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              Dashboard
            </a>
            <a
              href="/insights"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              Insights & Recommendations
            </a>
            <a
              href="/uploads"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              Uploaded Reports
            </a>
            <a
              href="/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              Settings
            </a>
          </nav>
        </div>
      </aside>
      <main className={cn("flex w-full flex-col overflow-hidden p-4 md:p-6", className)}>{children}</main>
    </div>
  )
}

