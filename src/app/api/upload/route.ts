import { getUserSession } from "@/lib/server/auth"
import { db } from "@/lib/server/db"
import { testRecordSelectSchema, testRecords, testResultSelectSchema, testResults } from "@/lib/server/db/tests"
import { PDFExtractor } from "@/lib/server/pdf-reader"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { eq } from "drizzle-orm"
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

      const records = await db.query.testRecords.findMany({
        where: eq(testRecords.userId, userId),
      })
      // Get the record IDs to use in the filter
      const userRecordIds = records.map((record) => record.id)
      // Then get test results that belong to those records
      const existingResults = await db.query.testResults.findMany({
        where: (results, { inArray }) => inArray(results.recordId, userRecordIds),
        columns: { testName: true, unit: true },
      })

      const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        schema,
        prompt:
          `You are a medical data extraction assistant. Your task is to extract test results and related information from medical documents.` +
          `\n\nTask: Extract structured data from the provided medical document content.` +
          `\n\nGuidelines:` +
          `\n1. Extract the test date, any notes, and all test results.` +
          `\n2. Translate all content to English if in another language.` +
          `\n3. For test names, check the existing test names first and use a matching one if similar.` +
          `\n4. Only create new test names when no similar test exists in the provided list.` +
          `\n5. Ensure all numeric values are properly extracted with their units when possible, if no unit try and infer it from the context.` +
          `\n6. Include reference ranges (min/max) when available.` +
          `\n7. Categorize each test appropriately (e.g., "Blood", "Urine", "Lipids", etc.).` +
          `\n\nDocument Content:` +
          `\n${JSON.stringify(content)}` +
          `\n\nExisting Test Names (use these when possible):` +
          `\n${JSON.stringify(existingResults.map((r) => r.testName))}`,
      })

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
