import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Lightbulb, Plus } from "lucide-react"
import type { Recommendation } from "@/lib/types"

interface RecommendationsListProps {
  recommendations: Recommendation[]
}

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-800"
      case "medium":
        return "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950 dark:border-amber-800"
      case "low":
        return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800"
      default:
        return "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendations</CardTitle>
        <CardDescription>Suggested actions based on your health data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              className={`rounded-lg border p-4 ${
                recommendation.completed
                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                  : `${getPriorityColor(recommendation.priority)}`
              }`}
            >
              <div className="flex items-start">
                <div className="mr-2 mt-0.5">
                  {recommendation.completed ? (
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Lightbulb className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{recommendation.title}</h4>
                  <p className="text-sm mt-1">{recommendation.description}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="rounded-lg border border-dashed p-4 text-center">
            <button className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <Plus className="h-4 w-4 mr-1" />
              Add custom recommendation
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

