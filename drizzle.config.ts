import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { env } from "@/lib/env"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/lib/server/db/schema.ts",
  out: "./src/lib/server/db/migrations",
  dialect: "postgresql",
  dbCredentials: { url: env.DATABASE_URL },
})
