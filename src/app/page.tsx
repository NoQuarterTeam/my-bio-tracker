import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { UploadPdfButton } from "@/components/upload-pdf-button"
import { RecentUploads } from "@/components/recent-uploads"
import { HealthMarkersOverview } from "@/components/health-markers-overview"
import { getHealthMarkers } from "@/lib/data"

export const metadata: Metadata = {
  title: "Dashboard | Blood Work Health Tracker",
  description: "Track and analyze your blood test results over time",
}

export default async function DashboardPage() {
  // Fetch data using RSC
  const markers = await getHealthMarkers()

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Upload and track your blood test results over time." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <UploadPdfButton />
        <RecentUploads />
      </div>
      <div className="mt-6">
        <HealthMarkersOverview markers={markers} />
      </div>
    </DashboardShell>
  )
}

