import "server-only"
import { TOAST_KEY, type Toast } from "@/lib/server/utils/set-toast"
import { cookies } from "next/headers"
import { Toaster } from "./toaster"

export async function ServerToaster() {
  const toast = (await cookies()).get(TOAST_KEY)
  const value = toast ? (JSON.parse(toast.value) as Toast) : null
  return <Toaster toast={value} />
}
