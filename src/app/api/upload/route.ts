import { getUserSession } from "@/lib/server/auth"
import { db } from "@/lib/server/db"
import { documentSelectSchema, documents, markerSelectSchema, markers } from "@/lib/server/db/tests"
import { PDFExtractor } from "@/lib/server/pdf-reader"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import dedent from "dedent"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { z } from "zod"
const pdfReader = new PDFExtractor()

const documentSchema = documentSelectSchema
  .omit({ id: true, createdAt: true, updatedAt: true, userId: true, date: true })
  .extend({ date: z.string() })
const markerSchema = markerSelectSchema.omit({ id: true, createdAt: true, documentId: true })

const schema = documentSchema.extend({
  markers: z.array(markerSchema),
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

      const docs = await db.query.documents.findMany({
        where: eq(documents.userId, userId),
      })
      // Get the document IDs to use in the filter
      const userDocumentIds = docs.map((doc) => doc.id)
      // Then get markers that belong to those documents
      const existingMarkers = await db.query.markers.findMany({
        where: (marker, { inArray }) => inArray(marker.documentId, userDocumentIds),
        columns: { name: true, unit: true },
      })

      const promptText = dedent`
      You are a medical data extraction assistant. Your task is to extract markers and related information from medical documents.
      
      Task: Extract structured data from the provided medical document content.
      
      Guidelines:
      1. Extract the test date, any notes, and all markers.
      2. Translate all content to English if in another language.
      3. For marker names, check the existing marker names first and use a matching one if similar.
      4. Only create new marker names when no similar marker exists in the provided list.
      5. Ensure all numeric values are properly extracted with their units when possible, if no unit try and infer it from the context.
      6. Include reference ranges (min/max) when available.
      
      Document Content:
      ${content}
      
      Expected Output Format:
      {
        "date": "YYYY-MM-DD",
        "notes": "Any notes about the document",
        "markers": [
          {
            "name": "Marker Name",
            "value": "Numeric value as string",
            "unit": "Unit of measurement",
            "category": "Category (e.g., Blood, Urine, etc.)",
            "referenceMin": "Minimum reference value if available",
            "referenceMax": "Maximum reference value if available"
          }
        ]
      }
      
      Existing Marker Names (use these when possible):
      ${JSON.stringify(existingMarkers.map((m) => m.name))}
      `

      // Generate the structured data using AI
      const result = await generateObject({
        model: openai("gpt-4o"),
        prompt: promptText,
        schema,
      })

      // Define the type for our result
      type DocumentData = {
        date: string
        notes: string
        markers: Array<{
          name: string
          value: string
          unit: string | null
          category: string
          referenceMin: string | null
          referenceMax: string | null
          documentId?: string
        }>
      }

      // Cast the result to our expected type
      const documentData = result as unknown as DocumentData

      // Insert the document
      const [doc] = await db
        .insert(documents)
        .values({ date: new Date(documentData.date), notes: documentData.notes, userId })
        .returning()

      // Insert all markers
      if (documentData.markers.length > 0) {
        await db.insert(markers).values(
          documentData.markers.map((marker) => ({
            ...marker,
            documentId: doc.id,
          })),
        )
      }
    }

    revalidatePath("/")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: "Failed to process document" }, { status: 500 })
  }
}
