"use server"

import { clearSession, getCurrentUser } from "@/lib/server/auth"
import { db } from "@/lib/server/db"
import { users } from "@/lib/server/db/user"
import { setToast } from "@/lib/server/utils/set-toast"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateUserName(formData: FormData) {
  const user = await getCurrentUser()
  const name = formData.get("name") as string
  if (!name || name.trim() === "") {
    return await setToast({ type: "error", message: "Name cannot be empty" })
  }

  try {
    await db.update(users).set({ name }).where(eq(users.id, user.id))
    revalidatePath("/profile")
    await setToast({ type: "success", message: "Name updated successfully" })
  } catch {
    await setToast({ type: "error", message: "Failed to update name" })
  }
}

export async function deleteUserAccount() {
  const user = await getCurrentUser()
  try {
    await db.delete(users).where(eq(users.id, user.id))

    await clearSession()
    await setToast({
      type: "success",
      message: "Account deleted successfully",
    })
    redirect("/")
  } catch (_error) {
    await setToast({
      type: "error",
      message: "Failed to delete account",
    })
  }
}
