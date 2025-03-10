import { getAdmin } from "@/lib/server/auth"
import type * as React from "react"

export default async function Layout({ children }: { children: React.ReactNode }) {
  await getAdmin()
  return <>{children}</>
}
