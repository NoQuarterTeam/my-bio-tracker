"use server"

import { getAdmin } from "@/server/models/user/auth"
import { getSuggestions } from "./data"

export async function getFollupSuggestions(initialMessage: string) {
  await getAdmin()
  const suggestions = await getSuggestions(initialMessage)
  return suggestions
}
