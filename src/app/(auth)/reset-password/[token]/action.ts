"use server"

import { setUserSession } from "@/lib/server/auth"
import { db } from "@/lib/server/db"
import { users } from "@/lib/server/db/user"
import { decodeToken } from "@/lib/server/utils/jwt"
import { setToast } from "@/lib/server/utils/set-toast"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { z } from "zod"

const resetPasswordSchema = z
  .object({ password: z.string().min(8).trim(), confirmPassword: z.string().min(8).trim() })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export async function resetPasswordAction(formData: FormData) {
  // Validate form data
  const validatedFields = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!validatedFields.success) return await setToast({ type: "error", message: "Invalid password" })

  const token = formData.get("token") as string
  // Verify token and extract user ID
  let userId: string
  try {
    const decoded = decodeToken<{ userId: string }>(token)
    userId = decoded.userId
  } catch {
    return await setToast({ type: "error", message: "Invalid or expired token" })
  }

  // Check if user exists
  const userExists = await db.query.users.findFirst({ where: eq(users.id, userId) })
  if (!userExists) {
    await setToast({ type: "error", message: "User not found" })
    return redirect("/forgot-password")
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10)

  // Update user password
  await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId))

  // Set success message
  await setToast({ type: "success", message: "Password reset successfully" })

  // Log user in
  await setUserSession(userId)

  // Redirect to home page
  redirect("/")
}
