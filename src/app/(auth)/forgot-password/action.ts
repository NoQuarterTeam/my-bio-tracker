"use server"

import { APP_URL } from "@/lib/env"
import { sendEmail } from "@/lib/loops"
import { db } from "@/lib/server/db"
import { users } from "@/lib/server/db/user"
import { createToken } from "@/lib/server/utils/jwt"
import { setToast } from "@/lib/server/utils/set-toast"
import { eq } from "drizzle-orm"
import { z } from "zod"

const forgotPasswordSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
})

export async function forgotPasswordAction(formData: FormData) {
  const validatedFields = forgotPasswordSchema.safeParse({ email: formData.get("email") })

  if (!validatedFields.success) return await setToast({ type: "error", message: "Please enter a valid email address" })

  const { email } = validatedFields.data

  // Check if user exists
  const user = await db.query.users.findFirst({ where: eq(users.email, email) })

  // Always return success even if user doesn't exist for security reasons
  if (!user) {
    return await setToast({
      type: "success",
      message: "If an account with that email exists, we've sent a password reset link",
    })
  }

  // Create a stateless JWT token with the user's ID
  const token = createToken(
    { userId: user.id },
    { expiresIn: "1h" }, // Token expires in 1 hour
  )

  // Generate reset URL
  const url = `${APP_URL}/reset-password/${token}`

  // Send email with reset link
  await sendEmail("ForgotPassword", email, { url })

  return await setToast({
    type: "success",
    message: "If an account with that email exists, we've sent a password reset link",
  })
}
