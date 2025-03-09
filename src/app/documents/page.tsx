import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mistral } from "@/lib/mistral"
import { getMaybeUser } from "@/lib/server/auth"
import { db } from "@/lib/server/db"
import { documents } from "@/lib/server/db/tests"
import { setToast } from "@/lib/server/utils/set-toast"
import { formatDate } from "@/lib/utils"
import { and, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import { redirect } from "next/navigation"
import { after } from "next/server"
import { DeleteDocumentDialog } from "./delete-document-dialog"

export default async function Page() {
  const user = await getMaybeUser()

  if (!user) redirect("/login")

  const docs = await db.query.documents.findMany({
    where: eq(documents.userId, user.id),
    orderBy: [desc(documents.date)],
    with: { markers: true },
  })

  async function deleteDocument(formData: FormData) {
    "use server"
    const user = await getMaybeUser()
    if (!user) redirect("/login")
    const documentId = formData.get("documentId") as string
    if (!documentId) return await setToast({ type: "error", message: "Document not found" })
    const document = await db.query.documents.findFirst({
      where: and(eq(documents.id, documentId), eq(documents.userId, user.id)),
    })
    if (!document) return await setToast({ type: "error", message: "Document not found" })
    await db.delete(documents).where(and(eq(documents.id, documentId), eq(documents.userId, user.id)))
    after(mistral.files.delete({ fileId: document.mistralId }))
    revalidatePath("/documents")
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="font-bold text-3xl tracking-tight">Documents</h1>
        <p className="text-muted-foreground">View and manage your documents</p>
      </div>

      {docs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="mb-4 text-muted-foreground">No documents found</p>
          <Button asChild>
            <Link href="/">Go to Dashboard</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc) => (
            <Card key={doc.id}>
              <CardHeader>
                <div className="flex items-start justify-between pt-6">
                  <CardTitle className="font-bold text-lg">{formatDate(doc.date)}</CardTitle>
                  <DeleteDocumentDialog documentId={doc.id} onDelete={deleteDocument} />
                </div>
                <CardDescription>
                  {doc.markers.length} marker{doc.markers.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {doc.notes ? (
                  <p className="text-sm">{doc.notes}</p>
                ) : (
                  <p className="text-muted-foreground text-sm italic">No notes</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
