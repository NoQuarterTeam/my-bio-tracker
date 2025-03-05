"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface MarkerDetailChartProps {
  data: { date: string; value: number }[]
  range: { min: number; max: number }
}

export function MarkerDetailChart({ data, range }: MarkerDetailChartProps) {
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
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString(undefined, { month: "short", year: "2-digit" })
            }
          />
          <YAxis
            domain={[
              Math.min(range.min * 0.8, Math.min(...data.map((d) => d.value)) * 0.8),
              Math.max(range.max * 1.2, Math.max(...data.map((d) => d.value)) * 1.2),
            ]}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ReferenceLine y={range.min} stroke="orange" strokeDasharray="3 3" />
          <ReferenceLine y={range.max} stroke stroke="orange" strokeDasharray="3 3" />
          <ReferenceLine y={range.max} stroke="red" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-value)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

