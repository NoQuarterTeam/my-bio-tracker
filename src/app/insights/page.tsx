import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { InsightsOverview } from "@/components/insights-overview"
import { RecommendationsList } from "@/components/recommendations-list"
import { getHealthMarkers } from "@/lib/data"
import { generateInsights, generateRecommendations } from "@/lib/insights"

export const metadata: Metadata = {
  title: "Insights & Recommendations | Blood Work Health Tracker",
  description: "Get personalized insights and recommendations based on your blood test results",
}

export default async function InsightsPage() {
  // Fetch data using RSC
  const markers = await getHealthMarkers()
  const insights = generateInsights(markers)
  const recommendations = generateRecommendations(markers)

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Insights & Recommendations"
        text="Get personalized insights and recommendations based on your blood test results."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <InsightsOverview insights={insights} />
        <RecommendationsList recommendations={recommendations} />
      </div>
    </DashboardShell>
  )
}

