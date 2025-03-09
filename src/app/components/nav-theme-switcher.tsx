"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function NavThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"
  return (
    <div className="relative flex items-center gap-6 px-2 py-1">
      <div className="flex items-center gap-2">
        {isDark ? <Moon size={16} className="text-muted-foreground" /> : <Sun size={16} className="text-muted-foreground" />}
        <p className="text-sm">Theme</p>
      </div>
      <Select value={theme || "system"} onValueChange={setTheme}>
        <SelectTrigger className="min-w-[100px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
