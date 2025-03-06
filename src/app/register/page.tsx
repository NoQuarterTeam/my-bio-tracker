import { FormButton } from "@/components/form-button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { registerAction } from "./action"

export default function Page() {
  return (
    <form action={registerAction} className="mx-auto flex max-w-md flex-col gap-2 py-8">
      <h1 className="font-bold text-4xl">Register</h1>
      <Input required type="text" placeholder="Name" name="name" />
      <Input required type="email" placeholder="Email" name="email" />
      <Input required type="password" placeholder="Password" name="password" />
      <FormButton>Register</FormButton>
      <Link href="/login">Already have an account? Login</Link>
    </form>
  )
}
