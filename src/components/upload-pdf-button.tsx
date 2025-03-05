"use client"

import type React from "react"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { uploadPdf } from "@/lib/actions"

export function UploadPdfButton() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return 95
          }
          return prev + 5
        })
      }, 100)

      const formData = new FormData()
      formData.append("pdf", file)

      await uploadPdf(formData)

      clearInterval(interval)
      setUploadProgress(100)

      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 1000)
    } catch (error) {
      console.error("Error uploading file:", error)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Blood Test PDF</CardTitle>
        <CardDescription>Upload your blood test results in PDF format</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex h-32 w-full items-center justify-center rounded-md border border-dashed">
            {isUploading ? (
              <div className="flex flex-col items-center space-y-2 w-4/5">
                <Progress value={uploadProgress} className="w-full" />
                <span className="text-sm text-muted-foreground">Processing... {uploadProgress}%</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Drag and drop or click to upload</p>
              </div>
            )}
          </div>
          <div className="flex w-full">
            <input
              type="file"
              id="pdf-upload"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <label htmlFor="pdf-upload" className="w-full">
              <Button className="w-full" disabled={isUploading} variant={isUploading ? "outline" : "default"}>
                {isUploading ? "Uploading..." : "Select PDF"}
              </Button>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

