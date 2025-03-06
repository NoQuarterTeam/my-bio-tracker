import "server-only"
import jwt from "jsonwebtoken"

import { env } from "@/lib/env"

type Payload = Record<string, any>

export const createToken = (payload: Payload, options?: jwt.SignOptions): string => {
  const token = jwt.sign(payload, env.APP_SECRET, {
    expiresIn: "4w",
    ...options,
  })
  return token
}

export function decodeToken<T>(token: string): T {
  jwt.verify(token, env.APP_SECRET)
  const payload = jwt.decode(token)
  return payload as T
}

export const createAuthToken = (payload: Payload): string => {
  const token = jwt.sign(payload, env.APP_AUTH_SECRET, {
    expiresIn: "5 weeks",
  })
  return token
}

export function decodeAuthToken<T>(token: string): T | null {
  try {
    jwt.verify(token, env.APP_AUTH_SECRET)
    const payload = jwt.decode(token)
    return payload as T
  } catch {
    return null
  }
}
