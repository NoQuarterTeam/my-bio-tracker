import type * as React from "react"
import { Nav } from "./components/nav"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Nav />
      <div className="flex-1">{children}</div>
    </div>
  )
}
