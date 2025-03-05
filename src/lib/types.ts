export interface HealthMarker {
  id: string
  name: string
  value: number
  unit: string
  range: {
    min: number
    max: number
  }
  category: string
  trend: number
  history: {
    date: string
    value: number
  }[]
}

export interface Insight {
  id: string
  title: string
  description: string
  type: "improvement" | "concern" | "stable"
  marker: string
  change: number
}

export interface Recommendation {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  completed: boolean
}

export interface Upload {
  id: string
  name: string
  date: string
  status: string
}

