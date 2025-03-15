import { LinkButton } from "@/components/link-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserSession } from "@/lib/server/auth"
import { db } from "@/lib/server/db"
import { and, eq } from "drizzle-orm"
import { ChevronLeftIcon } from "lucide-react"
import { notFound } from "next/navigation"
import { MarkerEditForm } from "../components/marker-edit-form"
interface PageProps {
  params: {
    name: string
  }
}

export default async function MarkerEditPage({ params }: PageProps) {
  const userId = await getUserSession()
  if (!userId) return notFound()

  // Decode the marker name from the URL
  const markerName = decodeURIComponent(params.name)

  // Fetch all markers with this name for the current user
  const markerEntries = await db.query.markers.findMany({
    where: (m) => and(eq(m.name, markerName), eq(m.userId, userId)),
    orderBy: (m) => m.createdAt,
    with: { document: true },
  })

  return (
    <div className="container py-6">
      <div className="mb-6 space-y-4">
        <LinkButton href="/" variant="outline" size="sm">
          <ChevronLeftIcon /> <span>Back to Dashboard</span>
        </LinkButton>
        <h1 className="mt-4 font-bold text-3xl">{markerName}</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Marker History</CardTitle>
            <CardDescription>Edit or delete your {markerName} markers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {markerEntries.map((marker) => (
              <MarkerEditForm key={marker.id} marker={marker} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
