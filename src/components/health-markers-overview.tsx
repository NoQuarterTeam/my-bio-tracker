"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HealthMarkerCard } from "@/components/health-marker-card"
import type { HealthMarker } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

interface HealthMarkersOverviewProps {
  markers: HealthMarker[]
}

export function HealthMarkersOverview({ markers }: HealthMarkersOverviewProps) {
  const categories = [
    { id: "all", name: "All Markers" },
    { id: "lipids", name: "Lipids" },
    { id: "metabolic", name: "Metabolic" },
    { id: "blood", name: "Blood Cells" },
    { id: "vitamins", name: "Vitamins" },
    { id: "hormones", name: "Hormones" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Markers</CardTitle>
        <CardDescription>Track your key health markers over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-4">
              {!markers.length ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-[180px] rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {markers
                    .filter((marker) => category.id === "all" || marker.category === category.id)
                    .map((marker) => (
                      <Link
                        key={marker.id}
                        href={`/markers/${marker.id}`}
                        className="block transition-opacity hover:opacity-90"
                      >
                        <HealthMarkerCard marker={marker} />
                      </Link>
                    ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

