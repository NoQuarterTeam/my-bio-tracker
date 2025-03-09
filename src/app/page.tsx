import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserSession } from "@/lib/server/auth"
import { db } from "@/lib/server/db"
import { documents } from "@/lib/server/db/tests"
import { eq } from "drizzle-orm"
import { Landing } from "./landing"
import { MarkerChart } from "./marker-chart"

export default async function Page() {
  const userId = await getUserSession()

  if (!userId) return <Landing />

  // First, get all documents that belong to the current user
  const docs = await db.query.documents.findMany({
    where: eq(documents.userId, userId),
  })

  // Get the document IDs to use in the filter
  const userDocumentIds = docs.map((doc) => doc.id)

  // Then get markers that belong to those documents
  const documentMarkers = await db.query.markers.findMany({
    where: (marker, { inArray }) => inArray(marker.documentId, userDocumentIds),
    with: { document: true },
  })

  // Group markers by name
  const markerTimelines = documentMarkers.reduce(
    (acc, marker) => {
      if (!acc[marker.name]) {
        acc[marker.name] = {
          unit: marker.unit || "",
          referenceMin: marker.referenceMin,
          referenceMax: marker.referenceMax,
          markers: [],
        }
      }
      acc[marker.name].markers.push(marker)

      return acc
    },
    {} as Record<
      string,
      { unit: string; referenceMin: string | null; referenceMax: string | null; markers: Array<(typeof documentMarkers)[number]> }
    >,
  )

  // Format data for charts
  const formatChartData = (markerName: string, timeline: (typeof markerTimelines)[string]) => {
    // Sort by date (oldest first for the chart)
    return [...timeline.markers]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((marker) => ({
        date: new Date(marker.createdAt).toLocaleDateString(),
        fullDate: new Date(marker.createdAt).toISOString().split("T")[0], // YYYY-MM-DD format
        value: Number.parseFloat(marker.value),
        dataKey: markerName,
      }))
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col space-y-1">
        <h2 className="font-bold text-xl">Health Markers Timeline</h2>
        <p className="text-muted-foreground text-sm">View your health markers over time to track your progress.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Object.entries(markerTimelines).map(([name, timeline]) => {
          const chartData = formatChartData(name, timeline)

          // Skip if no data
          if (chartData.length === 0) return null

          // Parse range values to numbers for reference lines
          const referenceMin = timeline.referenceMin ? Number.parseFloat(timeline.referenceMin) : 0
          const referenceMax = timeline.referenceMax ? Number.parseFloat(timeline.referenceMax) : 0

          return (
            <Card key={name} className="overflow-hidden">
              <CardHeader className="p-3 pb-0">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span>{name}</span>
                  <span className="font-normal text-muted-foreground text-xs">{timeline.unit}</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Range: {timeline.referenceMin || "N/A"} - {timeline.referenceMax || "N/A"} {timeline.unit}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="h-[160px]">
                  <MarkerChart
                    unit={timeline.unit}
                    name={name}
                    data={chartData}
                    referenceMin={referenceMin}
                    referenceMax={referenceMax}
                  />
                </div>
                {timeline.markers.length > 0 && (
                  <div className="mt-1 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">
                        Latest:{" "}
                        <span
                          className={
                            timeline.markers[0].value
                              ? referenceMin > 0 &&
                                referenceMax > 0 &&
                                Number.parseFloat(timeline.markers[0].value) >= referenceMin &&
                                Number.parseFloat(timeline.markers[0].value) <= referenceMax
                                ? "text-green-600"
                                : "text-red-500"
                              : "text-muted-foreground"
                          }
                        >
                          {timeline.markers[0]?.value || "N/A"}
                        </span>
                      </div>
                      <div className="text-right">
                        {timeline.markers.length > 1 && (
                          <span
                            className={
                              Number.parseFloat(timeline.markers[0].value) > Number.parseFloat(timeline.markers[1].value)
                                ? "text-green-500"
                                : Number.parseFloat(timeline.markers[0].value) < Number.parseFloat(timeline.markers[1].value)
                                  ? "text-red-500"
                                  : ""
                            }
                          >
                            {Number.parseFloat(timeline.markers[0].value) > Number.parseFloat(timeline.markers[1].value)
                              ? "↑"
                              : "↓"}
                            {Math.abs(
                              Number.parseFloat(timeline.markers[0].value) - Number.parseFloat(timeline.markers[1].value),
                            ).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
