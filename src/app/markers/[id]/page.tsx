import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { HealthMarkerDetail } from "@/components/health-marker-detail"
import { getHealthMarkerById } from "@/lib/data"

export const metadata: Metadata = {
  title: "Health Marker Details | Blood Work Health Tracker",
  description: "View detailed information about your health markers",
}

interface HealthMarkerPageProps {
  params: {
    id: string
  }
}

export default async function HealthMarkerPage({ params }: HealthMarkerPageProps) {
  // Fetch data using RSC
  const marker = await getHealthMarkerById(params.id)

  if (!marker) {
    notFound()
  }

  return (
    <DashboardShell>
      <DashboardHeader heading={marker.name} text="View detailed information and trends for this health marker." />
      <HealthMarkerDetail marker={marker} />
    </DashboardShell>
  )
}

