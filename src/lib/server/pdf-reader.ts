import fs from "node:fs/promises"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import type { PDFDocumentLoadingTask } from "pdfjs-dist"
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs"
import type { TextItem } from "pdfjs-dist/types/src/display/api"
dayjs.extend(utc)
dayjs.extend(timezone)

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start }, (_, i) => start + i)
}

export class PDFExtractor {
  isDataUrl(url: string) {
    return url.startsWith("data:")
  }

  parseDataUrl(url: string) {
    const protocol = url.slice(0, url.indexOf(":"))
    const contentType = url.slice(url.indexOf(":") + 1, url.indexOf(";"))
    const data = url.slice(url.indexOf(",") + 1)

    if (protocol !== "data" || !data) throw new Error("Invalid data URL")

    if (contentType !== "application/pdf") throw new Error("Invalid data URL type")

    return { type: contentType, data: data }
  }

  /**
   * Converts a File object to an ArrayBuffer in Node.js
   */
  async fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    // Check if the File object has an arrayBuffer method (Node.js v14+)
    if (typeof file.arrayBuffer === "function") return file.arrayBuffer()

    // For Node.js environments using Formidable or similar packages
    // that add a path property to the File object
    if ("path" in file) {
      const buffer = await fs.readFile((file as unknown as { path: string }).path)

      // Convert Buffer to ArrayBuffer and ensure it's an ArrayBuffer, not a SharedArrayBuffer
      return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer
    }

    // If we can't handle the File object, throw an error
    throw new Error("Unable to read File object in this Node.js environment")
  }

  /**
   * Extracts text content from a PDF
   * @param url - URL, data URL, or File object containing the PDF
   * @returns Object containing metadata, formatted content, and raw text
   */
  async extract(url: string | URL | File) {
    let loadingTask: PDFDocumentLoadingTask

    if (url instanceof File) {
      // Handle File object in Node.js
      try {
        const arrayBuffer = await this.fileToArrayBuffer(url)
        loadingTask = getDocument({
          data: new Uint8Array(arrayBuffer),
          disableFontFace: true,
          verbosity: 0,
        })
      } catch (error) {
        throw new Error(`Failed to process File: ${(error as Error).message}`)
      }
    } else if (typeof url === "string" && this.isDataUrl(url)) {
      const { data } = this.parseDataUrl(url)
      const binary = Uint8Array.from(Buffer.from(data, "base64"))
      loadingTask = getDocument({ data: binary, disableFontFace: true, verbosity: 0 })
    } else {
      loadingTask = getDocument({ url, disableFontFace: true, verbosity: 0 })
    }

    const doc = await loadingTask.promise
    const meta = await doc.getMetadata()

    const textItems: TextItem[][] = []

    for (const pg of range(0, doc.numPages)) {
      const page = await doc.getPage(pg + 1)
      const textContent = await page.getTextContent()
      textItems.push(textContent.items as TextItem[])
    }

    const rawChunks: string[] = []

    for (const pageTextItems of textItems) {
      for (const textItem of pageTextItems) {
        rawChunks.push(`${textItem.str}${textItem.hasEOL ? "\n" : ""}`)
      }
    }

    return { meta: meta.info as Record<string, any>, text: rawChunks.join("") }
  }
}
