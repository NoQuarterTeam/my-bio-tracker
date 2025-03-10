import type React from "react"
import "./globals.css"
import { ServerToaster } from "@/components/server-toaster"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import { Suspense } from "react"
import { Toaster } from "sonner"

const sans = Outfit({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Blood Work Health Tracker",
  description: "Track and analyze your health markers over time",
  icons: { icon: "/favicon.ico" },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", sans.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
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
