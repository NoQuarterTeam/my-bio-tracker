import { FormButton } from "@/components/form-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { getCurrentUser } from "@/lib/server/auth"
import { deleteUserAccount, updateUserName } from "./actions"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="mb-6 font-bold text-3xl">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-1 font-medium text-sm">Email</p>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>

          <form action={updateUserName} className="space-y-2">
            <div>
              <p className="mb-1 font-medium text-sm">Name</p>
              <Input name="name" defaultValue={user.name} className="max-w-sm" />
            </div>
            <FormButton size="sm">Update Name</FormButton>
          </form>
        </CardContent>
        <CardFooter className="border-t">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <form action={deleteUserAccount}>
                  <FormButton variant="destructive">Delete Account</FormButton>
                </form>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  )
}
