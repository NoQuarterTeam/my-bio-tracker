import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Check, AlertCircle } from "lucide-react"
import { getRecentUploads } from "@/lib/data"

export async function RecentUploads() {
  // Fetch data using RSC
  const uploads = await getRecentUploads()

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Uploads</CardTitle>
        <CardDescription>Your recently uploaded blood test reports</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {uploads.map((upload) => (
            <div key={upload.id} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <FileText className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium leading-none">{upload.name}</p>
                  <p className="text-sm text-muted-foreground">{new Date(upload.date).toLocaleDateString()}</p>
                </div>
              </div>
              {upload.status === "processed" ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

