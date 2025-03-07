import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserSession } from "@/lib/server/auth"
import { db } from "@/lib/server/db"
import { testRecords } from "@/lib/server/db/schema"
import { eq } from "drizzle-orm"
import { TestChart } from "./test-chart"

export default async function Page() {
  const userId = await getUserSession()

  getUserSession()

  if (!userId) return <div>Login in to do stuff</div>

  // First, get all records that belong to the current user
  const records = await db.query.testRecords.findMany({
    where: eq(testRecords.userId, userId),
  })

  // Get the record IDs to use in the filter
  const userRecordIds = records.map((record) => record.id)

  // Then get test results that belong to those records
  const testResults = await db.query.testResults.findMany({
    where: (results, { inArray }) => inArray(results.recordId, userRecordIds),
    with: { record: true },
  })

  // Group test results by test name
  const testTimelines = testResults.reduce(
    (acc, result) => {
      if (!acc[result.testName]) {
        acc[result.testName] = {
          unit: result.unit || "",
          referenceMin: result.referenceMin,
          referenceMax: result.referenceMax,
          results: [],
        }
      }
      acc[result.testName].results.push({ ...result, date: result.record.date })

      return acc
    },
    {} as Record<
      string,
      {
        unit: string
        referenceMin: string | null
        referenceMax: string | null
        results: Array<(typeof testResults)[number] & { date: Date }>
      }
    >,
  )

  // Format data for charts
  const formatChartData = (testName: string, timeline: (typeof testTimelines)[string]) => {
    // Sort by date (oldest first for the chart)
    return [...timeline.results]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((result) => ({
        date: new Date(result.date).toLocaleDateString(),
        fullDate: new Date(result.date).toISOString().split("T")[0], // YYYY-MM-DD format
        value: Number.parseFloat(result.value),
        dataKey: testName,
      }))
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col space-y-1">
        <h2 className="font-bold text-xl">Blood Test Timeline</h2>
        <p className="text-muted-foreground text-sm">View your blood test results over time to track your progress.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Object.entries(testTimelines).map(([name, timeline]) => {
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
                  <TestChart
                    unit={timeline.unit}
                    name={name}
                    data={chartData}
                    referenceMin={referenceMin}
                    referenceMax={referenceMax}
                  />
                </div>
                {timeline.results.length > 0 && (
                  <div className="mt-1 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">
                        Latest:{" "}
                        <span
                          className={
                            timeline.results[0].value
                              ? referenceMin > 0 &&
                                referenceMax > 0 &&
                                Number.parseFloat(timeline.results[0].value) >= referenceMin &&
                                Number.parseFloat(timeline.results[0].value) <= referenceMax
                                ? "text-green-600"
                                : "text-red-500"
                              : "text-muted-foreground"
                          }
                        >
                          {timeline.results[0]?.value || "N/A"}
                        </span>
                      </div>
                      <div className="text-right">
                        {timeline.results.length > 1 && (
                          <span
                            className={
                              Number.parseFloat(timeline.results[0].value) > Number.parseFloat(timeline.results[1].value)
                                ? "text-green-500"
                                : Number.parseFloat(timeline.results[0].value) < Number.parseFloat(timeline.results[1].value)
                                  ? "text-red-500"
                                  : ""
                            }
                          >
                            {Number.parseFloat(timeline.results[0].value) > Number.parseFloat(timeline.results[1].value)
                              ? "↑"
                              : "↓"}
                            {Math.abs(
                              Number.parseFloat(timeline.results[0].value) - Number.parseFloat(timeline.results[1].value),
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
