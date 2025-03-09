import { FormButton } from "@/components/form-button"
import { Input } from "@/components/ui/input"
import { decodeToken } from "@/lib/server/utils/jwt"
import Link from "next/link"
import { redirect } from "next/navigation"
import { resetPasswordAction } from "./action"

interface ResetPasswordPageProps {
  params: Promise<{ token: string }>
}

export default async function Page({ params }: ResetPasswordPageProps) {
  // Verify token is valid
  const { token } = await params
  try {
    decodeToken<{ userId: string }>(token)
  } catch {
    // If token is invalid or expired, redirect to forgot password page
    redirect("/forgot-password?error=invalid-token")
  }

  return (
    <form action={resetPasswordAction} className="mx-auto flex max-w-md flex-col gap-2 py-8">
      <h1 className="font-bold text-4xl">Reset Password</h1>
      <p className="text-muted-foreground">Enter your new password below.</p>
      <input type="hidden" name="token" value={token} />
      <Input required type="password" placeholder="New Password" name="password" minLength={8} />
      <Input required type="password" placeholder="Confirm Password" name="confirmPassword" minLength={8} />
      <FormButton>Reset Password</FormButton>
      <Link href="/login">Back to login</Link>
    </form>
  )
}
