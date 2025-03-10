import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Test Records | BioTracker",
  description: "View and manage your test records",
}

interface TestRecordsLayoutProps {
  children: React.ReactNode
}

export default function TestRecordsLayout({ children }: TestRecordsLayoutProps) {
  return <>{children}</>
}
