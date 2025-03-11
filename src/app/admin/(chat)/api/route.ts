import { getAdmin } from "@/lib/server/auth"
import { readOnlyDb } from "@/lib/server/db"
import { openai as openaiSdk } from "@ai-sdk/openai"
import { convertToCoreMessages, smoothStream, streamText } from "ai"
import type { Message } from "ai"
import { sql } from "drizzle-orm"
import { z } from "zod"
export const maxDuration = 300

export async function POST(req: Request) {
  // Ensure only admins can access this route
  await getAdmin()

  const json = (await req.json()) as { messages: Message[] }

  const coreMessages = convertToCoreMessages(json.messages.slice(-6))

  const databaseSchema = await getDbSchema()

  const result = streamText({
    model: openaiSdk("gpt-4o"),
    maxSteps: 5,
    // @ts-ignore
    experimental_transform: smoothStream({ chunking: "word" }),
    system:
      `You are a database expert assistant for administrators. You help admins quickly find and analyze data in the database.\n` +
      `You have access to a tool that allows you to execute PostgreSQL queries to retrieve information from the database.\n` +
      `CAPABILITIES:\n` +
      `- You only have read access to the database\n` +
      `- You can execute PostgreSQL queries to retrieve information from the database\n` +
      `- You can provide an overview of the schema if a user asks."\n` +
      `- You can help admins explore tables, find specific records, and analyze data\n` +
      `- You can suggest optimized queries based on the admin's needs\n` +
      `- You can use all PostgreSQL features including JSONB operations, joins, array functions, and window functions\n` +
      `- If the query error's, try again with a different approach, considering the guidelines.\n\n` +
      `QUERY GUIDELINES:\n` +
      `- Don't return user's that are admins in any of the results unless the user asks for them specifically, admins are users with isAdmin set to true\n` +
      `- Always limit result sets: use LIMIT 20 by default, or up to LIMIT 100 if explicitly requested.\n` +
      `- For large tables, always use appropriate WHERE clauses to filter results.\n` +
      `- When writing queries that require a join, try and include information about the tables that are being joined e.g (email, names etc)\n` +
      `- Always include ORDER BY clauses for meaningful sorting.\n` +
      `- For very complex operations, break them down into smaller, more manageable queries, however make sure to use joins when it makes sense.\n` +
      `- CRITICAL: ALWAYS cast COUNT results to integers using ::int. For example, write COUNT(*)::int or COUNT("Order".id)::int in EVERY query that uses COUNT. NEVER omit the ::int cast for COUNT operations.\n` +
      `- CRITICAL: NEVER return a user's password hash.\n\n` +
      `RESPONSE FORMAT:\n` +
      `- Present query results in well-formatted markdown tables when asking for a list of items\n` +
      `- For large result sets, summarize key findings as well\n` +
      `- Explain what the data represents\n` +
      `- Suggest follow-up queries when appropriate\n\n` +
      `DATABASE SCHEMA:\n` +
      JSON.stringify(databaseSchema, null, 2),
    messages: coreMessages,
    toolCallStreaming: true,
    // toolChoice: "required",
    experimental_continueSteps: true,
    tools: {
      queryDatabase: {
        description:
          "Executes PostgreSQL queries against the application database. This tool provides direct access to the PostgreSQL database and returns results as JSON objects. It handles all valid PostgreSQL syntax including complex operations like joins, aggregations, and PostgreSQL-specific functions. If an error occurs during execution, an error message will be returned instead of results.",
        parameters: z.object({
          query: z
            .string()
            .describe(
              "A complete, valid PostgreSQL query string to execute against the database. Must follow PostgreSQL syntax and reference existing tables and columns",
            ),
        }),
        execute: async ({ query }) => {
          try {
            const result = await readOnlyDb.execute<any>(sql.raw(query))
            const rows = result.rows
            if (rows && Array.isArray(rows) && rows.length === 0) return "No results found"
            // check if anything in result is a bigint and convert it to a string, result could be any array of objects
            const resultWithBigIntConverted = rows.map((item: any) =>
              Object.fromEntries(
                Object.entries(item).map(([key, value]) => [
                  key,
                  typeof value === "bigint" ? (Number.isSafeInteger(Number(value)) ? Number(value) : value.toString()) : value,
                ]),
              ),
            )
            return resultWithBigIntConverted
          } catch (error) {
            if (error instanceof Error && error.message.includes("Do not know how to serialize a BigInt")) {
              throw new Error("Do not know how to serialize a BigInt")
            }
            return `Error querying the database: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        },
      },
    },
  })

  return result.toDataStreamResponse()
}

type DatabaseSchema = {
  table_name: string
  column_name: string
  data_type: string
  enum_value: string
}

async function getDbSchema() {
  const databaseSchema = await readOnlyDb.execute<DatabaseSchema>(
    sql.raw(`
      WITH enum_values AS (
        SELECT 
          t.typname AS enum_type,
          e.enumlabel AS enum_value
        FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
      )
      SELECT 
        c.table_name,
        c.column_name,
        c.data_type,
        ev.enum_value
      FROM information_schema.columns c
      LEFT JOIN enum_values ev ON c.udt_name = ev.enum_type
      WHERE c.table_schema = 'public' 
      ORDER BY c.table_name, c.ordinal_position;`),
  )
  return databaseSchema.rows
}
