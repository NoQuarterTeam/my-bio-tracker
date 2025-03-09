import { FormButton } from "@/components/form-button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { forgotPasswordAction } from "./action"

interface ForgotPasswordPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: ForgotPasswordPageProps) {
  const { error } = await searchParams

  return (
    <form action={forgotPasswordAction} className="mx-auto flex max-w-md flex-col gap-2 py-8">
      <h1 className="font-bold text-4xl">Forgot Password</h1>
      <p className="text-muted-foreground">Enter your email address and we&apos;ll send you a link to reset your password.</p>

      {error === "invalid-token" && (
        <Alert variant="destructive" className="mb-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>The password reset link is invalid or has expired. Please request a new one.</AlertDescription>
        </Alert>
      )}

      <Input required type="email" placeholder="Email" name="email" />
      <FormButton>Send Reset Link</FormButton>
      <Link href="/login">Remember your password? Login</Link>
    </form>
  )
}
