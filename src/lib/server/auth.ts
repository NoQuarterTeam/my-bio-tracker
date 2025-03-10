import "server-only"

import { eq } from "drizzle-orm"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { userAgent } from "next/server"
import { cache } from "react"
import { env } from "../env"
import { db } from "./db"
import { users } from "./db/user"
import { createAuthToken, decodeAuthToken } from "./utils/jwt"

const AUTH_COOKIE = "auth"

export async function getUserSession() {
  const encyptedUserId = (await cookies()).get(AUTH_COOKIE)?.value
  if (!encyptedUserId) return null
  const token = decodeAuthToken<{ id: string }>(encyptedUserId)
  if (!token) return null
  return token.id
}

const twoMonth = 30 * 24 * 60 * 60 * 2

export async function setUserSession(id: string) {
  const encyptedUserId = createAuthToken({ id })
  return (await cookies()).set(AUTH_COOKIE, encyptedUserId, {
    secure: env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: twoMonth,
  })
}

export async function clearSession() {
  ;(await cookies()).delete(AUTH_COOKIE)
}

export const baseUserSelectFields = {
  id: true,
  email: true,
  name: true,
  avatar: true,
  isAdmin: true,
}

export const getMaybeUser = cache(async () => {
  const userId = await getUserSession()
  if (!userId) return null
  const maybeUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { id: true, email: true, name: true, avatar: true, isAdmin: true },
  })

  // @ts-ignore
  if (maybeUser?.password) throw new Error("You can not access password")
  return maybeUser
})

export const getCurrentUser = cache(async () => {
  const user = await getMaybeUser()
  if (!user) redirect("/login")
  return user!
})

export async function requireUser() {
  const agent = userAgent({ headers: await headers() })
  if (agent.isBot) return null // hack to allow bots access to metadata, need to check everywhere that a user is required and prevent data access
  const userId = await getUserSession()
  if (!userId) return redirect("/login")
  return userId!
}

export async function requireAdmin() {
  const user = await getMaybeUser()
  if (!user?.isAdmin) redirect("/")
  return user!
}

export async function getAdmin() {
  const user = await getMaybeUser()
  if (!user?.isAdmin) redirect("/")
  return user!
}
