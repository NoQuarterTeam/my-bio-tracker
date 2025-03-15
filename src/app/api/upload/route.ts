import { mistral } from "@/lib/mistral"
import { getUserSession } from "@/lib/server/auth"
import { db } from "@/lib/server/db"
import { documentSelectSchema, documents, markerSelectSchema, markers } from "@/lib/server/db/tests"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import dedent from "dedent"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { z } from "zod"

const documentSchema = documentSelectSchema
  .omit({ id: true, fileName: true, content: true, createdAt: true, updatedAt: true, userId: true, date: true })
  .extend({ date: z.string() })

const markerSchema = markerSelectSchema.omit({ id: true, userId: true, createdAt: true, updatedAt: true, documentId: true })

const schema = documentSchema.extend({ markers: z.array(markerSchema) })

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const userId = await getUserSession()

    if (!userId) redirect("/login")

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    for (const file of files) {
      const mistalFile = await mistral.files.upload({
        file: { fileName: file.name, content: file },
        // @ts-ignore
        purpose: "ocr",
      })
      const signedUrl = await mistral.files.getSignedUrl({ fileId: mistalFile.id })
      const ocrResponse = await mistral.ocr.process({
        model: "mistral-ocr-latest",
        document: { type: "document_url", documentUrl: signedUrl.url },
      })
      // const { text: content } = await generateText({
      //   model: mistral("mistral-small-latest"),
      //   messages: [
      //     {
      //       role: "user",
      //       content: [
      //         { type: "text", text: "Extract all the text from this document" },
      //         { type: "file", data: new Uint8Array(await file.arrayBuffer()), mimeType: "application/pdf" },
      //       ],
      //     },
      //   ],
      // })

      const docs = await db.query.documents.findMany({ where: eq(documents.userId, userId) })
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
        1. Extract the test dates, any notes, document title, and all markers.
        2. Translate all content to English if in another language.
        3. Format all the marker names in the same way where possible and capitalize the first letter of each word.
        4. For marker names, check the existing marker names first and use a matching one if similar.
        5. Only create new marker names when no similar marker exists in the provided list.
        6. Ensure all numeric values are properly extracted with their units when possible, if no unit try and infer it from the context.
        7. Include reference ranges (min/max) when available.
        
        Document Content:
        ${ocrResponse.pages.map((page) => page.markdown).join("\n")}
        
        Existing Markers (use these when possible):
        ${JSON.stringify(existingMarkers.map((m) => ({ name: m.name, unit: m.unit })))}
      `

      // Generate the structured data using AI
      const result = await generateObject({ model: openai("gpt-4o"), prompt: promptText, schema })

      const documentData = result.object

      // Insert the document
      const [doc] = await db
        .insert(documents)
        .values({
          fileName: file.name,
          content: ocrResponse.pages.map((page) => page.markdown).join("\n"),
          date: new Date(documentData.date),
          notes: documentData.notes,
          title: documentData.title,
          userId,
          mistralId: mistalFile.id,
        })
        .returning()

      // Insert all markers
      if (documentData.markers.length > 0) {
        await db.insert(markers).values(documentData.markers.map((marker) => ({ ...marker, userId, documentId: doc.id })))
      }
    }

    revalidatePath("/")
    revalidatePath("/documents")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: "Failed to process document" }, { status: 500 })
  }
}
