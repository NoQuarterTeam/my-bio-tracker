"use server"

import { setUserSession } from "@/lib/server/auth"
import { db } from "@/lib/server/db"
import { users } from "@/lib/server/db/user"
import { setToast } from "@/lib/server/utils/set-toast"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8).trim(),
})

export async function loginAction(formData: FormData) {
  const validatedFields = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") })
  if (!validatedFields.success) return await setToast({ type: "error", message: "Missing information" })

  const user = await db.query.users.findFirst({ where: eq(users.email, validatedFields.data.email) })

  if (!user) return await setToast({ type: "error", message: "Invalid email or password" })

  const hashedPassword = await bcrypt.compare(validatedFields.data.password, user.password)

  if (!hashedPassword) return await setToast({ type: "error", message: "Invalid email or password" })

  await setUserSession(user.id)
  redirect("/")
}
