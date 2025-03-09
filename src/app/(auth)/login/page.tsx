import { FormButton } from "@/components/form-button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { loginAction } from "./action"

export default function Page() {
  return (
    <form action={loginAction} className="mx-auto flex max-w-md flex-col gap-2 py-8">
      <h1 className="font-bold text-4xl">Login</h1>
      <Input required type="email" placeholder="Email" name="email" />
      <Input required type="password" placeholder="Password" name="password" />
      <FormButton>Login</FormButton>
      <Link href="/register">Don&apos;t have an account? Register</Link>
      <Link href="/forgot-password" className="text-muted-foreground text-sm">
        Forgot your password?
      </Link>
    </form>
  )
}
