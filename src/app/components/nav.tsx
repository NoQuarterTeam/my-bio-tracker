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
import { LogOutIcon, Settings, User, UserIcon } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { UploadDocument } from "./upload-document"

export async function Nav() {
  const user = await getMaybeUser()

  return (
    <nav className="flex items-center justify-between border-b px-6 py-4">
      <Link href="/">
        <span className="font-semibold text-lg">BioTracker</span>
      </Link>

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
                  <DropdownMenuItem>
                    <User />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 h-px bg-border" />
                  {user ? (
                    <DropdownMenuItem
                      onClick={async () => {
                        "use server"
                        await clearSession()
                        redirect("/login")
                      }}
                    >
                      <LogOutIcon />
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
