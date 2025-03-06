"use client"
import type { Toast } from "@/lib/server/utils/set-toast"
import { useEffect } from "react"
import { toast } from "sonner"

export function Toaster(props: { toast: Toast | null }) {
  useEffect(() => {
    if (props.toast) {
      const { type, message, description, duration } = props.toast
      if (type === "success") {
        toast.success(message, { description, duration })
      } else if (type === "error") {
        toast.error(message, { description, duration })
      }
    }
  }, [props.toast])
  return null
}
