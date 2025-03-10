"use client"

import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { CartesianGrid, Line, LineChart, ReferenceArea, XAxis, YAxis } from "recharts"

interface Props {
  name: string
  referenceMin: number
  referenceMax: number
  unit: string
  data: {
    date: string
    fullDate: string
    value: number
    dataKey: string
  }[]
}

export function MarkerChart({ name, referenceMax, referenceMin, unit, data }: Props) {
  const chartConfig = {
    [name]: {
      label: name,
      color: "#0ea5e9", // Sky blue color
    },
  }

  return (
    <ChartContainer config={chartConfig} className="px-0">
      <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 9 }}
          tickMargin={5}
          tickFormatter={(value, index) => {
            // Show fewer ticks for better readability
            return index % Math.ceil(data.length / 2) === 0 ? value : ""
          }}
        />
        <YAxis
          tick={{ fontSize: 9 }}
          tickMargin={5}
          width={25}
          domain={[
            (dataMin: number) => Math.min(dataMin * 0.95, referenceMin > 0 ? referenceMin * 0.9 : dataMin * 0.9).toFixed(2),
            (dataMax: number) => Math.max(dataMax * 1.05, referenceMax > 0 ? referenceMax * 1.1 : dataMax * 1.1).toFixed(5),
          ]}
        />

        {referenceMin > 0 && referenceMax > 0 && (
          <ReferenceArea y1={referenceMin} y2={referenceMax} fill="#10b98130" fillOpacity={0.2} />
        )}

        <ChartTooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const value = payload[0].value as number
              const isInRange = referenceMin > 0 && referenceMax > 0 ? value >= referenceMin && value <= referenceMax : true

              return (
                <div className="grid min-w-[8rem] items-start gap-1 rounded-lg border border-border/50 bg-background px-2 py-1 text-xs shadow-xl">
                  <div className="font-medium">{payload[0].payload.fullDate}</div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{name}</span>
                    <span className={`font-medium font-mono ${isInRange ? "text-green-600" : "text-red-500"}`}>
                      {payload[0].value} {unit}
                    </span>
                  </div>
                </div>
              )
            }
            return null
          }}
        />

        <Line
          type="monotone"
          dataKey="value"
          name={name}
          strokeWidth={1.5}
          dot={{ r: 2.5 }}
          activeDot={{ r: 4 }}
          isAnimationActive={true}
        />
      </LineChart>
    </ChartContainer>
  )
}
