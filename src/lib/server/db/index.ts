import { env } from "@/lib/env"
import { drizzle } from "drizzle-orm/neon-http"
import { withReplicas } from "drizzle-orm/pg-core"
import * as schema from "./schema"

export const primaryDb = drizzle(env.DATABASE_URL, { schema })
export const readOnlyDb = drizzle(env.DATABASE_URL_READ_ONLY, { schema })

export const db = withReplicas(primaryDb, [readOnlyDb])

export { schema }
