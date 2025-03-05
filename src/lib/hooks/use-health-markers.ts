"use client"

import { useState, useEffect } from "react"
import type { HealthMarker } from "@/lib/types"

export function useHealthMarkers() {
  const [markers, setMarkers] = useState<HealthMarker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchMarkers() {
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll simulate a delay and return mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data - in a real app, this would come from the API
        const mockMarkers = [
          {
            id: "cholesterol",
            name: "Total Cholesterol",
            value: 185,
            unit: "mg/dL",
            range: { min: 125, max: 200 },
            category: "lipids",
            trend: -5,
            history: [
              { date: "2023-06-01", value: 195 },
              { date: "2023-07-01", value: 190 },
              { date: "2023-08-01", value: 188 },
              { date: "2023-09-01", value: 185 },
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
              { date: "2023-06-01", value: 55 },
              { date: "2023-07-01", value: 58 },
              { date: "2023-08-01", value: 60 },
              { date: "2023-09-01", value: 62 },
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
              { date: "2023-06-01", value: 130 },
              { date: "2023-07-01", value: 125 },
              { date: "2023-08-01", value: 118 },
              { date: "2023-09-01", value: 110 },
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
              { date: "2023-06-01", value: 145 },
              { date: "2023-07-01", value: 135 },
              { date: "2023-08-01", value: 128 },
              { date: "2023-09-01", value: 120 },
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
              { date: "2023-06-01", value: 90 },
              { date: "2023-07-01", value: 92 },
              { date: "2023-08-01", value: 93 },
              { date: "2023-09-01", value: 95 },
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
              { date: "2023-06-01", value: 5.4 },
              { date: "2023-07-01", value: 5.4 },
              { date: "2023-08-01", value: 5.4 },
              { date: "2023-09-01", value: 5.4 },
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
              { date: "2023-06-01", value: 75 },
              { date: "2023-07-01", value: 80 },
              { date: "2023-08-01", value: 85 },
              { date: "2023-09-01", value: 95 },
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
              { date: "2023-06-01", value: 22 },
              { date: "2023-07-01", value: 24 },
              { date: "2023-08-01", value: 26 },
              { date: "2023-09-01", value: 28 },
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
              { date: "2023-06-01", value: 2.8 },
              { date: "2023-07-01", value: 2.7 },
              { date: "2023-08-01", value: 2.6 },
              { date: "2023-09-01", value: 2.5 },
            ],
          },
        ]

        setMarkers(mockMarkers)
        setIsLoading(false)
      } catch (err) {
        setError(err as Error)
        setIsLoading(false)
      }
    }

    fetchMarkers()
  }, [])

  return { markers, isLoading, error }
}

