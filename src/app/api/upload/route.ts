import { getUserSession } from "@/lib/server/auth"
import { db } from "@/lib/server/db"
import { testRecordSelectSchema, testRecords, testResultSelectSchema, testResults } from "@/lib/server/db/tests"
import { PDFExtractor } from "@/lib/server/pdf-reader"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { z } from "zod"

const pdfReader = new PDFExtractor()

const testRecordSchema = testRecordSelectSchema
  .omit({ id: true, createdAt: true, updatedAt: true, userId: true, date: true })
  .extend({ date: z.string() })
const testResultSchema = testResultSelectSchema.omit({ id: true, createdAt: true, recordId: true })

const schema = testRecordSchema.extend({
  results: z.array(testResultSchema),
})

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const userId = await getUserSession()

    if (!userId) redirect("/login")

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    for (const file of files) {
      const content = await pdfReader.extract(file)

      const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        schema,
        prompt: `Extract the results and information from the following text, and translate to english if needed: ${JSON.stringify(content)}`,
      })

      // Save to database

      // Insert the test record
      const [record] = await db
        .insert(testRecords)
        .values({ date: new Date(object.date), notes: object.notes, userId })
        .returning()

      // Insert all test results
      if (object.results.length > 0) {
        await db.insert(testResults).values(object.results.map((result) => ({ ...result, recordId: record.id })))
      }
    }

    revalidatePath("/")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: "Error uploading file" }, { status: 500 })
  }
}
