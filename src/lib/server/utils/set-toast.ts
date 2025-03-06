import "server-only"
import { cookies } from "next/headers"

export type Toast = { type: "success" | "error"; message: string; description?: string; duration?: number }

export const TOAST_KEY = "toast"

export async function setToast(toast: Partial<Toast> & { message: string }) {
  const type = toast.type || "success"
  const toashCookies = await cookies()

  const expires = new Date()
  expires.setSeconds(expires.getSeconds() + 2)

  toashCookies.set(TOAST_KEY, JSON.stringify({ ...toast, type }), { path: "/", expires })
}
