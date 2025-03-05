import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { HealthMarker } from "@/lib/types"
import { AlertCircle, Info, Lightbulb } from "lucide-react"

interface MarkerInsightsProps {
  marker: HealthMarker
}

export function MarkerInsights({ marker }: MarkerInsightsProps) {
  const getInsights = () => {
    if (marker.value < marker.range.min) {
      return {
        status: "low",
        title: `Your ${marker.name} is below the reference range`,
        description: `Low ${marker.name} levels may indicate ${getLowLevelIndication(marker.id)}`,
        recommendations: getLowLevelRecommendations(marker.id),
      }
    } else if (marker.value > marker.range.max) {
      return {
        status: "high",
        title: `Your ${marker.name} is above the reference range`,
        description: `High ${marker.name} levels may indicate ${getHighLevelIndication(marker.id)}`,
        recommendations: getHighLevelRecommendations(marker.id),
      }
    } else {
      return {
        status: "normal",
        title: `Your ${marker.name} is within the normal range`,
        description: `Your ${marker.name} levels are healthy. Keep up the good work!`,
        recommendations: getNormalLevelRecommendations(marker.id),
      }
    }
  }

  const insights = getInsights()

  return (
    <div className="space-y-4">
      <Alert variant={insights.status === "normal" ? "default" : "destructive"}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{insights.title}</AlertTitle>
        <AlertDescription>{insights.description}</AlertDescription>
      </Alert>

      <div className="space-y-2">
        <h4 className="font-medium flex items-center">
          <Lightbulb className="h-4 w-4 mr-2" />
          Recommendations
        </h4>
        <ul className="space-y-2">
          {insights.recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start">
              <Info className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// Helper functions to get marker-specific insights
function getLowLevelIndication(markerId: string): string {
  const indications = {
    cholesterol: "potential malnutrition or certain genetic conditions.",
    glucose: "hypoglycemia, which can be caused by medication, excessive insulin, or liver disease.",
    hdl: "increased risk of heart disease.",
    iron: "iron deficiency anemia, which can cause fatigue and weakness.",
    vitaminD: "bone health issues, weakened immune system, or limited sun exposure.",
    default: "potential health concerns that should be discussed with your healthcare provider.",
  }

  return indications[markerId as keyof typeof indications] || indications.default
}

function getHighLevelIndication(markerId: string): string {
  const indications = {
    cholesterol: "increased risk of heart disease and stroke.",
    glucose: "prediabetes or diabetes, which can lead to various health complications if not managed.",
    hdl: "generally positive, as high HDL is protective against heart disease.",
    iron: "iron overload, which can damage organs if left untreated.",
    vitaminD: "potential toxicity, which is rare but can cause nausea, vomiting, and weakness.",
    default: "potential health concerns that should be discussed with your healthcare provider.",
  }

  return indications[markerId as keyof typeof indications] || indications.default
}

function getLowLevelRecommendations(markerId: string): string[] {
  const recommendations = {
    cholesterol: [
      "Consult with your healthcare provider to rule out underlying conditions.",
      "Ensure you're consuming a balanced diet with adequate healthy fats.",
      "Consider a follow-up test to confirm the results.",
    ],
    glucose: [
      "Eat regular, balanced meals to maintain stable blood sugar levels.",
      "Discuss with your doctor if you're experiencing symptoms like dizziness or fatigue.",
      "If you're on diabetes medication, your dosage might need adjustment.",
    ],
    hdl: [
      "Increase physical activity, as exercise can raise HDL levels.",
      "Include healthy fats like olive oil, nuts, and avocados in your diet.",
      "Consider reducing refined carbohydrates and increasing fiber intake.",
    ],
    iron: [
      "Include more iron-rich foods in your diet, such as lean red meat, beans, and leafy greens.",
      "Consider iron supplements after consulting with your healthcare provider.",
      "Get tested for conditions that might cause iron deficiency.",
    ],
    vitaminD: [
      "Spend more time outdoors in sunlight (with appropriate sun protection).",
      "Include vitamin D-rich foods like fatty fish and fortified dairy products in your diet.",
      "Consider vitamin D supplements after consulting with your healthcare provider.",
    ],
    default: [
      "Consult with your healthcare provider to understand the implications of your results.",
      "Consider lifestyle modifications that might help improve your levels.",
      "Schedule a follow-up test to monitor changes over time.",
    ],
  }

  return recommendations[markerId as keyof typeof recommendations] || recommendations.default
}

function getHighLevelRecommendations(markerId: string): string[] {
  const recommendations = {
    cholesterol: [
      "Reduce saturated and trans fat intake by limiting processed foods and fatty meats.",
      "Increase physical activity to help lower cholesterol levels.",
      "Consider adding more soluble fiber to your diet through foods like oats and beans.",
    ],
    glucose: [
      "Limit intake of refined carbohydrates and sugars.",
      "Increase physical activity to help regulate blood sugar levels.",
      "Monitor your levels regularly and consult with your healthcare provider about management strategies.",
    ],
    hdl: [
      "Continue with your current healthy lifestyle practices.",
      "Maintain regular physical activity and a balanced diet.",
      "Share these positive results with your healthcare provider during your next visit.",
    ],
    iron: [
      "Reduce consumption of iron-rich foods and supplements.",
      "Consult with your healthcare provider to rule out hemochromatosis or other conditions.",
      "Consider regular blood donation if recommended by your doctor.",
    ],
    vitaminD: [
      "Reduce vitamin D supplementation if you're currently taking supplements.",
      "Discuss with your healthcare provider to determine if further testing is needed.",
      "Monitor your levels with follow-up testing.",
    ],
    default: [
      "Consult with your healthcare provider to understand the implications of your results.",
      "Consider lifestyle modifications that might help normalize your levels.",
      "Schedule a follow-up test to monitor changes over time.",
    ],
  }

  return recommendations[markerId as keyof typeof recommendations] || recommendations.default
}

function getNormalLevelRecommendations(markerId: string): string[] {
  return [
    "Continue with your current healthy lifestyle practices.",
    "Maintain regular check-ups to monitor your health markers over time.",
    "Stay informed about recommended screening intervals for your age and risk factors.",
  ]
}

