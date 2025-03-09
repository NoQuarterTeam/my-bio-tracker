import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { MarkerChart } from "./marker-chart"

const sampleChartData = {
  cholesterol: {
    name: "Cholesterol",
    unit: "mg/dL",
    referenceMin: 125,
    referenceMax: 200,
    data: [
      { date: "Jan 2023", fullDate: "2023-01-15", value: 210, dataKey: "Cholesterol" },
      { date: "Mar 2023", fullDate: "2023-03-10", value: 195, dataKey: "Cholesterol" },
      { date: "May 2023", fullDate: "2023-05-22", value: 180, dataKey: "Cholesterol" },
      { date: "Jul 2023", fullDate: "2023-07-15", value: 175, dataKey: "Cholesterol" },
      { date: "Sep 2023", fullDate: "2023-09-05", value: 165, dataKey: "Cholesterol" },
    ],
  },
  glucose: {
    name: "Glucose",
    unit: "mg/dL",
    referenceMin: 70,
    referenceMax: 100,
    data: [
      { date: "Jan 2023", fullDate: "2023-01-15", value: 105, dataKey: "Glucose" },
      { date: "Mar 2023", fullDate: "2023-03-10", value: 98, dataKey: "Glucose" },
      { date: "May 2023", fullDate: "2023-05-22", value: 92, dataKey: "Glucose" },
      { date: "Jul 2023", fullDate: "2023-07-15", value: 88, dataKey: "Glucose" },
      { date: "Sep 2023", fullDate: "2023-09-05", value: 85, dataKey: "Glucose" },
    ],
  },
  vitaminD: {
    name: "Vitamin D",
    unit: "ng/mL",
    referenceMin: 30,
    referenceMax: 80,
    data: [
      { date: "Jan 2023", fullDate: "2023-01-15", value: 25, dataKey: "Vitamin D" },
      { date: "Mar 2023", fullDate: "2023-03-10", value: 32, dataKey: "Vitamin D" },
      { date: "May 2023", fullDate: "2023-05-22", value: 45, dataKey: "Vitamin D" },
      { date: "Jul 2023", fullDate: "2023-07-15", value: 55, dataKey: "Vitamin D" },
      { date: "Sep 2023", fullDate: "2023-09-05", value: 60, dataKey: "Vitamin D" },
    ],
  },
}

export function Landing() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
      <div className="max-w-6xl space-y-6">
        <div>
          <h1 className="font-bold text-4xl tracking-tight">Track your Bio markers by uploading any lab results</h1>
          <p className="text-muted-foreground text-xl">
            Your personal health metrics dashboard for monitoring biomarkers and health data over time. All code is open source
            and available on{" "}
            <a href="https://github.com/NoQuarterTeam/my-bio-tracker" className="underline">
              GitHub
            </a>
            . Feel free to contribute or host it yourself!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 md:grid-cols-3">
          {Object.entries(sampleChartData).map(([key, chartInfo]) => (
            <Card key={key} className="overflow-hidden">
              <CardHeader className="p-3 pb-0">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span>{chartInfo.name}</span>
                  <span className="font-normal text-muted-foreground text-xs">{chartInfo.unit}</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Range: {chartInfo.referenceMin} - {chartInfo.referenceMax} {chartInfo.unit}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="h-[160px]">
                  <MarkerChart
                    unit={chartInfo.unit}
                    name={chartInfo.name}
                    data={chartInfo.data}
                    referenceMin={chartInfo.referenceMin}
                    referenceMax={chartInfo.referenceMax}
                  />
                </div>
                <div className="mt-2 text-sm">
                  <p className="text-center text-muted-foreground">Sample data visualization</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/register">Create an Account</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
