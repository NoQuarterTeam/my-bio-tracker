import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserSession } from "@/lib/server/auth"
import { db } from "@/lib/server/db"
import { markers } from "@/lib/server/db/tests"
import { eq } from "drizzle-orm"
import { AddManualMarker } from "./components/add-manual-marker"
import { UploadDocument } from "./components/upload-document"
import { Landing } from "./landing"
import { MarkerChart } from "./marker-chart"

export default async function Page() {
  const userId = await getUserSession()

  if (!userId) return <Landing />

  // Then get markers that belong to those documents
  const documentMarkers = await db.query.markers.findMany({
    where: eq(markers.userId, userId),
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
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Health Markers Timeline</h1>
          <p className="text-muted-foreground">View your health markers over time to track your progress.</p>
        </div>
        <AddManualMarker />
      </div>

      {documentMarkers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border py-16">
          <h3 className="mb-2 font-semibold text-xl">No markers yet</h3>
          <p className="mb-6 max-w-md text-center text-muted-foreground">
            Upload your first document or add a manual marker to get started tracking your biomarkers
          </p>
          <div className="flex gap-4">
            <UploadDocument />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Object.entries(markerTimelines).map(([name, timeline]) => {
            const chartData = formatChartData(name, timeline)

            // Skip if no data
            if (chartData.length === 0) return null

            // Parse range values to numbers for reference lines
            const referenceMin = timeline.referenceMin ? Number.parseFloat(timeline.referenceMin) : null
            const referenceMax = timeline.referenceMax ? Number.parseFloat(timeline.referenceMax) : null

            return (
              <Card key={name} className="overflow-hidden">
                <CardHeader className="p-3 pb-0">
                  <CardTitle className="flex items-center justify-between text-sm">
                    <span>{name}</span>
                    <span className="font-normal text-muted-foreground text-xs">{timeline.unit}</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Range:{" "}
                    {timeline.referenceMin && timeline.referenceMax
                      ? `${timeline.referenceMin} - ${timeline.referenceMax} ${timeline.unit}`
                      : null}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="h-[160px]">
                    <MarkerChart
                      unit={timeline.unit}
                      name={name}
                      data={chartData}
                      referenceMin={referenceMin || 0}
                      referenceMax={referenceMax || 0}
                    />
                  </div>
                  {timeline.markers.length > 0 && (
                    <div className="mt-1 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">
                          Latest:{" "}
                          <span
                            className={
                              timeline.markers[0].value && referenceMin && referenceMax
                                ? Number.parseFloat(timeline.markers[0].value) >= referenceMin &&
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
      )}
    </div>
  )
}
