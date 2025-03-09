import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { clearSession, getMaybeUser } from "@/lib/server/auth"
import { ClipboardList, HomeIcon, LogOutIcon, User, UserIcon } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { NavThemeSwitcher } from "./nav-theme-switcher"
import { UploadDocument } from "./upload-document"

export async function Nav() {
  const user = await getMaybeUser()

  return (
    <nav className="flex items-center justify-between border-b px-6 py-4">
      <div className="flex items-center gap-3">
        <Link href="/" className="whitespace-nowrap font-semibold text-lg">
          My Bio Tracker
        </Link>
        <Button className="hidden md:flex" variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center gap-2">
            <HomeIcon className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </Button>
        <Button className="hidden md:flex" variant="ghost" size="sm" asChild>
          <Link href="/documents" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <span>Documents</span>
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <UploadDocument />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full border p-2">
                  <UserIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuPortal>
                <DropdownMenuContent className="min-w-[180px]" sideOffset={5} align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex cursor-pointer items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/documents" className="flex cursor-pointer items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      <span>Documents</span>
                    </Link>
                  </DropdownMenuItem>
                  <NavThemeSwitcher />
                  <DropdownMenuSeparator className="my-1 h-px bg-border" />
                  {user ? (
                    <DropdownMenuItem
                      onClick={async () => {
                        "use server"
                        await clearSession()
                        redirect("/login")
                      }}
                    >
                      <LogOutIcon className="h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link href="/login">Login</Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>
          </>
        ) : (
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </nav>
  )
}
