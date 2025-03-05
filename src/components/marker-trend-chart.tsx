"use client"

import { Line, LineChart, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface MarkerTrendChartProps {
  data: { date: string; value: number }[]
}

export function MarkerTrendChart({ data }: MarkerTrendChartProps) {
  return (
    <ChartContainer
      config={{
        value: {
          label: "Value",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

