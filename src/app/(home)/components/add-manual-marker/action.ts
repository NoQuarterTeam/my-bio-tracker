"use server"

import { getCurrentUser } from "@/lib/server/auth"
import { db } from "@/lib/server/db"
import { markers } from "@/lib/server/db/schema"
import { revalidatePath } from "next/cache"
import { markerDefaults } from "./static"

export async function addMarker(formData: FormData) {
  const user = await getCurrentUser()

  const name = formData.get("name") as string
  const value = formData.get("value") as string
  if (!name || !value) throw new Error("Missing required fields")

  const markerInfo = markerDefaults[name]
  if (!markerInfo) throw new Error("Invalid marker type")

  // Insert the marker
  await db.insert(markers).values({
    name,
    value,
    unit: markerInfo.unit,
    category: markerInfo.category,
    referenceMin: markerInfo.min,
    referenceMax: markerInfo.max,
    userId: user.id,
  })

  revalidatePath("/")
}
