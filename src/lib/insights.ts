import type { HealthMarker, Insight, Recommendation } from "@/lib/types"

// Generate insights based on health markers
export function generateInsights(markers: HealthMarker[]): Insight[] {
  const insights: Insight[] = []

  // Check for markers outside of normal range
  for (const marker of markers) {
    // Skip markers with no history
    if (marker.history.length < 2) continue

    const latestValue = marker.value
    const previousValue = marker.history[marker.history.length - 2].value
    const change = Math.round(((latestValue - previousValue) / previousValue) * 100)

    // Check if value is outside normal range
    if (latestValue < marker.range.min) {
      insights.push({
        id: `${marker.id}-low`,
        title: `Low ${marker.name} levels`,
        description: `Your ${marker.name} is below the recommended range. Consider consulting with your healthcare provider.`,
        type: "concern",
        marker: marker.name,
        change,
      })
    } else if (latestValue > marker.range.max) {
      insights.push({
        id: `${marker.id}-high`,
        title: `High ${marker.name} levels`,
        description: `Your ${marker.name} is above the recommended range. Consider consulting with your healthcare provider.`,
        type: "concern",
        marker: marker.name,
        change,
      })
    }
    // Check for significant improvements
    else if (previousValue < marker.range.min && latestValue >= marker.range.min) {
      insights.push({
        id: `${marker.id}-improved`,
        title: `${marker.name} levels improving`,
        description: `Your ${marker.name} has improved from below normal to within the normal range.`,
        type: "improvement",
        marker: marker.name,
        change,
      })
    }
    // Check for significant deterioration
    else if (previousValue >= marker.range.min && latestValue < marker.range.min) {
      insights.push({
        id: `${marker.id}-deteriorated`,
        title: `${marker.name} levels decreasing`,
        description: `Your ${marker.name} has decreased from normal to below the normal range.`,
        type: "concern",
        marker: marker.name,
        change,
      })
    }
    // Check for stable values
    else if (Math.abs(change) < 5) {
      insights.push({
        id: `${marker.id}-stable`,
        title: `${marker.name} levels stable`,
        description: `Your ${marker.name} remains stable within the normal range.`,
        type: "stable",
        marker: marker.name,
        change,
      })
    }
    // Check for significant improvements within normal range
    else if (change < -10) {
      insights.push({
        id: `${marker.id}-improving`,
        title: `${marker.name} levels improving`,
        description: `Your ${marker.name} has decreased by ${Math.abs(change)}% since your last test.`,
        type: "improvement",
        marker: marker.name,
        change,
      })
    }
  }

  return insights
}

// Generate recommendations based on health markers
export function generateRecommendations(markers: HealthMarker[]): Recommendation[] {
  const recommendations: Recommendation[] = []

  // Check for vitamin D deficiency
  const vitaminD = markers.find((m) => m.id === "vitaminD")
  if (vitaminD && vitaminD.value < vitaminD.range.min) {
    recommendations.push({
      id: "rec-vitaminD",
      title: "Increase vitamin D intake",
      description: "Consider taking a vitamin D supplement or spending more time outdoors.",
      completed: false,
      priority: "high",
    })
  }

  // Check for high cholesterol
  const cholesterol = markers.find((m) => m.id === "cholesterol")
  if (cholesterol && cholesterol.value > cholesterol.range.max) {
    recommendations.push({
      id: "rec-cholesterol",
      title: "Reduce cholesterol intake",
      description: "Consider reducing saturated fats and increasing fiber in your diet.",
      completed: false,
      priority: "high",
    })
  } else if (cholesterol && cholesterol.value < cholesterol.range.max * 0.8) {
    recommendations.push({
      id: "rec-cholesterol-good",
      title: "Continue heart-healthy diet",
      description: "Your cholesterol levels are excellent. Continue with your current dietary habits.",
      completed: true,
      priority: "low",
    })
  }

  // Check for high glucose
  const glucose = markers.find((m) => m.id === "glucose")
  if (glucose && glucose.value > glucose.range.max) {
    recommendations.push({
      id: "rec-glucose",
      title: "Monitor blood sugar levels",
      description: "Your glucose levels are elevated. Consider reducing sugar intake and increasing physical activity.",
      completed: false,
      priority: "high",
    })
  }

  // Check for iron levels
  const iron = markers.find((m) => m.id === "iron")
  if (iron) {
    if (iron.value < iron.range.min) {
      recommendations.push({
        id: "rec-iron-low",
        title: "Increase iron intake",
        description: "Consider eating more iron-rich foods like lean red meat, beans, and leafy greens.",
        completed: false,
        priority: "medium",
      })
    } else if (iron.value > iron.range.max) {
      recommendations.push({
        id: "rec-iron-high",
        title: "Schedule follow-up for iron levels",
        description: "Your iron levels are elevated. Schedule a follow-up test in 3 months.",
        completed: false,
        priority: "medium",
      })
    }
  }

  // General recommendations
  recommendations.push({
    id: "rec-general-1",
    title: "Schedule annual checkup",
    description: "Regular checkups are important for monitoring your health. Schedule your next annual exam.",
    completed: false,
    priority: "medium",
  })

  recommendations.push({
    id: "rec-general-2",
    title: "Stay hydrated",
    description: "Drinking adequate water is essential for overall health and can improve many health markers.",
    completed: false,
    priority: "low",
  })

  return recommendations
}

