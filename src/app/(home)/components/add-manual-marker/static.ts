export const markerDefaults: Record<string, { unit: string; category: string; min?: string; max?: string }> = {
  "Blood Pressure": { unit: "mmHg", category: "Cardiovascular", min: "90/60", max: "120/80" },
  "Resting Heart Rate": { unit: "bpm", category: "Cardiovascular", min: "40", max: "70" },
  "Body Weight": { unit: "kg", category: "Body Composition" },
}
