import { getAdmin } from "@/lib/server/auth"
import { Chat } from "./chat"

export default async function Page() {
  await getAdmin()
  return <Chat />
}
