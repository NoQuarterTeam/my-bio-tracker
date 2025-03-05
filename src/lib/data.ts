import { getAllHealthMarkers } from "@/lib/db"
import { generateInsights } from "@/lib/insights"

// Get all health markers
export async function getHealthMarkers() {
  return getAllHealthMarkers()
}

// Get a specific health marker by ID
export async function getHealthMarkerById(id: string) {
  const markers = await getAllHealthMarkers()
  return markers.find((marker) => marker.id === id)
}

// Get recent uploads
export async function getRecentUploads() {
  return getRecentUploads()
}

// Get insights
export async function getInsights() {
  const markers = await getAllHealthMarkers()
  return generateInsights(markers)
}

// Get recommendations
export async function getRecommendations() {
  return getRecommendations()
}

