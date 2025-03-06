import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    DATABASE_URL: z.string().url(),
    OPENAI_API_KEY: z.string().min(1),
    APP_SECRET: z.string().min(1),
    APP_AUTH_SECRET: z.string().min(1),
    NODE_ENV: z.enum(["development", "production", "preview"]).default("development"),
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_VERCEL_ENV: z.enum(["production", "preview", "development"]).default("development"),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    APP_SECRET: process.env.APP_SECRET,
    APP_AUTH_SECRET: process.env.APP_AUTH_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  },
})

export const isProduction = env.NEXT_PUBLIC_VERCEL_ENV === "production"
export const isPreview = env.NEXT_PUBLIC_VERCEL_ENV === "preview"
export const isDevelopment = env.NEXT_PUBLIC_VERCEL_ENV === "development"
