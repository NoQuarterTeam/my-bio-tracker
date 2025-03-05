"use server"

import { revalidatePath } from "next/cache"
import { extractDataFromPdf } from "@/lib/jina-ai"
import { saveBloodTestData } from "@/lib/db"

export async function uploadPdf(formData: FormData) {
  try {
    // Get the PDF file from the form data
    const pdfFile = formData.get("pdf") as File

    if (!pdfFile) {
      throw new Error("No PDF file provided")
    }

    // Convert the file to a buffer
    const buffer = await pdfFile.arrayBuffer()

    // Process the PDF with Jina.ai
    const extractedData = await extractDataFromPdf(buffer)

    // Save the extracted data to the database
    await saveBloodTestData(extractedData)

    // Revalidate the dashboard page to show the new data
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error uploading PDF:", error)
    return { success: false, error: (error as Error).message }
  }
}

