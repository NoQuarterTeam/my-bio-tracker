import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateTrend(currentValue: number, previousValue: number) {
  if (!previousValue) return 0
  return Math.round(((currentValue - previousValue) / previousValue) * 100)
}

