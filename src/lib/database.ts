// This is a mock implementation of database operations
// In a real application, you would use a real database like MongoDB, PostgreSQL, etc.

import type { HealthMarker } from "@/lib/types"

// Mock database
const mockDatabase = {
  users: [
    {
      id: "user1",
      name: "John Doe",
      email: "john.doe@example.com",
    },
  ],
  bloodTests: [] as any[],
  healthMarkers: [] as HealthMarker[],
}

// Initialize with some sample data
initializeMockData()

export async function saveBloodTestData(data: any) {
  // Add the test to the blood tests collection
  const testId = `test_${Date.now()}`

  mockDatabase.bloodTests.push({
    id: testId,
    userId: "user1",
    ...data,
  })

  // Update or add health markers
  for (const marker of data.markers) {
    const existingMarkerIndex = mockDatabase.healthMarkers.findIndex((m) => m.id === marker.id)

    const historyEntry = {
      date: data.testDate,
      value: marker.value,
    }

    if (existingMarkerIndex >= 0) {
      // Update existing marker
      const existingMarker = mockDatabase.healthMarkers[existingMarkerIndex]
      const previousValue = existingMarker.value

      mockDatabase.healthMarkers[existingMarkerIndex] = {
        ...existingMarker,
        value: marker.value,
        trend: calculateTrend(marker.value, previousValue),
        history: [...existingMarker.history, historyEntry].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        ),
      }
    } else {
      // Add new marker
      mockDatabase.healthMarkers.push({
        ...marker,
        trend: 0,
        history: [historyEntry],
      })
    }
  }

  return { success: true }
}

export async function getHealthMarkers() {
  return mockDatabase.healthMarkers
}

export async function getHealthMarkerById(id: string) {
  return mockDatabase.healthMarkers.find((marker) => marker.id === id)
}

function calculateTrend(currentValue: number, previousValue: number) {
  if (!previousValue) return 0
  return Math.round(((currentValue - previousValue) / previousValue) * 100)
}

function initializeMockData() {
  // Generate historical data for the past 6 months
  const now = new Date()
  const dates = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(now)
    date.setMonth(date.getMonth() - i)
    return date.toISOString()
  }).reverse()

  // Sample markers with historical data
  mockDatabase.healthMarkers = [
    {
      id: "cholesterol",
      name: "Total Cholesterol",
      value: 185,
      unit: "mg/dL",
      range: { min: 125, max: 200 },
      category: "lipids",
      trend: -5,
      history: [
        { date: dates[0], value: 195 },
        { date: dates[1], value: 190 },
        { date: dates[2], value: 188 },
        { date: dates[3], value: 185 },
      ],
    },
    {
      id: "hdl",
      name: "HDL Cholesterol",
      value: 62,
      unit: "mg/dL",
      range: { min: 40, max: 60 },
      category: "lipids",
      trend: 3,
      history: [
        { date: dates[0], value: 55 },
        { date: dates[1], value: 58 },
        { date: dates[2], value: 60 },
        { date: dates[3], value: 62 },
      ],
    },
    {
      id: "ldl",
      name: "LDL Cholesterol",
      value: 110,
      unit: "mg/dL",
      range: { min: 0, max: 100 },
      category: "lipids",
      trend: -8,
      history: [
        { date: dates[0], value: 130 },
        { date: dates[1], value: 125 },
        { date: dates[2], value: 118 },
        { date: dates[3], value: 110 },
      ],
    },
    {
      id: "triglycerides",
      name: "Triglycerides",
      value: 120,
      unit: "mg/dL",
      range: { min: 0, max: 150 },
      category: "lipids",
      trend: -10,
      history: [
        { date: dates[0], value: 145 },
        { date: dates[1], value: 135 },
        { date: dates[2], value: 128 },
        { date: dates[3], value: 120 },
      ],
    },
    {
      id: "glucose",
      name: "Glucose",
      value: 95,
      unit: "mg/dL",
      range: { min: 70, max: 99 },
      category: "metabolic",
      trend: 2,
      history: [
        { date: dates[0], value: 90 },
        { date: dates[1], value: 92 },
        { date: dates[2], value: 93 },
        { date: dates[3], value: 95 },
      ],
    },
    {
      id: "hba1c",
      name: "HbA1c",
      value: 5.4,
      unit: "%",
      range: { min: 4.0, max: 5.6 },
      category: "metabolic",
      trend: 0,
      history: [
        { date: dates[0], value: 5.4 },
        { date: dates[1], value: 5.4 },
        { date: dates[2], value: 5.4 },
        { date: dates[3], value: 5.4 },
      ],
    },
    {
      id: "iron",
      name: "Iron",
      value: 95,
      unit: "μg/dL",
      range: { min: 60, max: 170 },
      category: "blood",
      trend: 15,
      history: [
        { date: dates[0], value: 75 },
        { date: dates[1], value: 80 },
        { date: dates[2], value: 85 },
        { date: dates[3], value: 95 },
      ],
    },
    {
      id: "vitaminD",
      name: "Vitamin D",
      value: 28,
      unit: "ng/mL",
      range: { min: 30, max: 100 },
      category: "vitamins",
      trend: 12,
      history: [
        { date: dates[0], value: 22 },
        { date: dates[1], value: 24 },
        { date: dates[2], value: 26 },
        { date: dates[3], value: 28 },
      ],
    },
    {
      id: "tsh",
      name: "TSH",
      value: 2.5,
      unit: "mIU/L",
      range: { min: 0.4, max: 4.0 },
      category: "hormones",
      trend: -5,
      history: [
        { date: dates[0], value: 2.8 },
        { date: dates[1], value: 2.7 },
        { date: dates[2], value: 2.6 },
        { date: dates[3], value: 2.5 },
      ],
    },
  ]
}

