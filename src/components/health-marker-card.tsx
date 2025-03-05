"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { HealthMarker } from "@/lib/types"
import { MarkerTrendChart } from "@/components/marker-trend-chart"

interface HealthMarkerCardProps {
  marker: HealthMarker
}

export function HealthMarkerCard({ marker }: HealthMarkerCardProps) {
  const getStatusColor = (value: number, min: number, max: number) => {
    if (value < min) return "text-amber-500"
    if (value > max) return "text-red-500"
    return "text-green-500"
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-red-500" />
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-green-500" />
    return <Minus className="h-4 w-4 text-muted-foreground" />
  }

  const getStatusBadge = (value: number, min: number, max: number) => {
    if (value < min)
      return (
        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
        >
          Low
        </Badge>
      )
    if (value > max)
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
        >
          High
        </Badge>
      )
    return (
      <Badge
        variant="outline"
        className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
      >
        Normal
      </Badge>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium">{marker.name}</h3>
            <p className="text-sm text-muted-foreground">{marker.unit}</p>
          </div>
          {getStatusBadge(marker.value, marker.range.min, marker.range.max)}
        </div>
        <div className="h-[80px] mt-4">
          <MarkerTrendChart data={marker.history} />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between border-t">
        <div className="flex items-center">
          <span className={`text-xl font-bold ${getStatusColor(marker.value, marker.range.min, marker.range.max)}`}>
            {marker.value}
          </span>
          <span className="text-xs text-muted-foreground ml-2">
            Range: {marker.range.min}-{marker.range.max}
          </span>
        </div>
        <div className="flex items-center">
          {getTrendIcon(marker.trend)}
          <span className="text-sm ml-1">{Math.abs(marker.trend)}%</span>
        </div>
      </CardFooter>
    </Card>
  )
}

