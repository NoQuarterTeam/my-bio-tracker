"use server"

import { setUserSession } from "@/lib/server/auth"
import { db } from "@/lib/server/db"
import { users } from "@/lib/server/db/user"
import { setToast } from "@/lib/server/utils/set-toast"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8).trim(),
  name: z.string().min(1).trim(),
})

export async function registerAction(formData: FormData) {
  const validatedFields = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password") as string,
    name: formData.get("name") as string,
  })

  if (!validatedFields.success) {
    await setToast({ type: "error", message: "Invalid details" })
    return
  }

  const existingUser = await db.query.users.findFirst({ where: eq(users.email, validatedFields.data.email) })
  if (existingUser) {
    await setToast({ type: "error", message: "User already exists" })
    return
  }

  const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10)
  const user = await db
    .insert(users)
    .values({ ...validatedFields.data, password: hashedPassword })
    .returning()

  if (!user[0]) {
    await setToast({ type: "error", message: "Something went wrong" })
    return
  }

  await setUserSession(user[0].id)

  redirect("/")
}
