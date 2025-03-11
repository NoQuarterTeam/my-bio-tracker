"use client"
import { type ButtonVariantProps, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link, { type LinkProps } from "next/link"
import * as React from "react"

export interface LinkButtonProps
  extends ButtonVariantProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>,
    LinkProps {
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(function _LinkButton(
  { variant = "secondary", size, disabled, ...props },
  ref,
) {
  return (
    <span className={cn(disabled && "cursor-not-allowed")}>
      <Link
        ref={ref}
        prefetch={false}
        suppressHydrationWarning
        {...props}
        className={cn(buttonVariants({ size, variant }), disabled && "pointer-events-none", props.className)}
      >
        {props.children}
      </Link>
    </span>
  )
})
