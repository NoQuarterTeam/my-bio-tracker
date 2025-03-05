import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { HealthMarker } from "@/lib/types"
import { MarkerDetailChart } from "@/components/marker-detail-chart"
import { MarkerReferenceRanges } from "@/components/marker-reference-ranges"
import { MarkerInsights } from "@/components/marker-insights"

interface HealthMarkerDetailProps {
  marker: HealthMarker
}

export function HealthMarkerDetail({ marker }: HealthMarkerDetailProps) {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Trend Over Time</CardTitle>
          <CardDescription>Track how your {marker.name} levels have changed over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <MarkerDetailChart data={marker.history} range={marker.range} />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="ranges">
        <TabsList>
          <TabsTrigger value="ranges">Reference Ranges</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="ranges">
          <Card>
            <CardHeader>
              <CardTitle>Reference Ranges</CardTitle>
              <CardDescription>Standard reference ranges for {marker.name} by age and gender</CardDescription>
            </CardHeader>
            <CardContent>
              <MarkerReferenceRanges marker={marker} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Insights & Recommendations</CardTitle>
              <CardDescription>Personalized insights based on your {marker.name} levels</CardDescription>
            </CardHeader>
            <CardContent>
              <MarkerInsights marker={marker} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

