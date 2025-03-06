import type React from "react"
import "./globals.css"
import { ServerToaster } from "@/components/server-toaster"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import { Toaster } from "sonner"
import { Nav } from "./components/nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Blood Work Health Tracker",
  description: "Track and analyze your blood test results over time",
  icons: { icon: "/favicon.ico" },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <Nav />
            <div className="flex-1">{children}</div>
          </div>
          <Toaster />
          <Suspense>
            <ServerToaster />
          </Suspense>
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  )
}
