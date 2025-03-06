"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LoaderIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { useFormStatus } from "react-dom"

export function FormButton(props: ComponentProps<typeof Button>) {
  const formStatus = useFormStatus()
  return (
    <Button type="submit" {...props} className={cn("relative", props.className)}>
      <span className={cn({ "opacity-0": formStatus.pending })}>{props.children}</span>
      {formStatus.pending && (
        <span className="absolute inset-0 flex items-center justify-center">
          <LoaderIcon className="size-4 animate-spin" />
        </span>
      )}
    </Button>
  )
}
