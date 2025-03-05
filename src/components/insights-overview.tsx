import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, TrendingDown, TrendingUp } from "lucide-react"
import type { Insight } from "@/lib/types"

interface InsightsOverviewProps {
  insights: Insight[]
}

export function InsightsOverview({ insights }: InsightsOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Insights</CardTitle>
        <CardDescription>Personalized insights based on your blood test results</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => (
            <Alert
              key={insight.id}
              variant={insight.type === "concern" ? "destructive" : "default"}
              className={
                insight.type === "improvement"
                  ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
                  : insight.type === "stable"
                    ? "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
                    : ""
              }
            >
              <div className="flex items-start">
                {insight.type === "improvement" ? (
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : insight.type === "concern" ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                )}
                <div className="ml-2 w-full">
                  <div className="flex items-center justify-between">
                    <AlertTitle>{insight.title}</AlertTitle>
                    <Badge variant="outline" className="ml-2">
                      {insight.marker}
                    </Badge>
                  </div>
                  <AlertDescription>{insight.description}</AlertDescription>
                  {insight.change !== 0 && (
                    <div className="mt-2 flex items-center text-sm">
                      {insight.change < 0 ? (
                        <>
                          <TrendingDown className="h-3 w-3 mr-1 text-green-600 dark:text-green-400" />
                          <span className="text-green-600 dark:text-green-400">
                            {Math.abs(insight.change)}% decrease
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="h-3 w-3 mr-1 text-red-600 dark:text-red-400" />
                          <span className="text-red-600 dark:text-red-400">{insight.change}% increase</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

