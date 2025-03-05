import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/bloodwork",
  },
  verbose: true,
  strict: true,
})

