"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"
import { useFormStatus } from "react-dom"

export function FormButton(props: ComponentProps<typeof Button>) {
  const formStatus = useFormStatus()
  return <Button type="submit" isLoading={formStatus.pending} {...props} className={cn("relative", props.className)} />
}
