"use server"

import { getCurrentUser } from "@/lib/server/auth"
import { db } from "@/lib/server/db"
import { markers } from "@/lib/server/db/tests"
import { setToast } from "@/lib/server/utils/set-toast"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function updateMarker(formData: FormData) {
  const user = await getCurrentUser()

  const id = formData.get("id") as string
  const value = formData.get("value") as string
  const date = formData.get("date") as string

  if (!id || !value || !date) {
    throw new Error("Missing required fields")
  }

  // Fetch the marker to ensure it belongs to the current user
  const marker = await db.query.markers.findFirst({ where: eq(markers.id, id) })

  if (!marker || marker.userId !== user.id) {
    throw new Error("Marker not found or unauthorized")
  }

  // Update the marker
  await db.update(markers).set({ value, updatedAt: new Date() }).where(eq(markers.id, id))

  // Revalidate both the marker edit page and the home page
  revalidatePath(`/marker/${encodeURIComponent(marker.name)}`)
  revalidatePath("/")

  await setToast({
    message: "Marker updated",
    description: "Your marker has been updated successfully",
  })
  return { success: true, message: "Marker updated successfully" }
}

export async function deleteMarker(id: string) {
  const user = await getCurrentUser()

  // Fetch the marker to ensure it belongs to the current user
  const marker = await db.query.markers.findFirst({
    where: eq(markers.id, id),
  })

  if (!marker || marker.userId !== user.id) {
    throw new Error("Marker not found or unauthorized")
  }

  // Delete the marker
  await db.delete(markers).where(eq(markers.id, id))

  // Revalidate both the marker edit page and the home page
  revalidatePath(`/marker/${encodeURIComponent(marker.name)}`)
  revalidatePath("/")

  await setToast({
    message: "Marker deleted",
    description: "Your marker has been deleted successfully",
  })
  return { success: true, message: "Marker deleted successfully" }
}
