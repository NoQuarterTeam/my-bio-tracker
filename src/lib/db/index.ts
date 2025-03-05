import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

// Database connection string
const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/bloodwork"

// Create postgres connection
const client = postgres(connectionString)

// Create drizzle database instance
export const db = drizzle(client, { schema })

// Export schema for use in other files
export { schema }

