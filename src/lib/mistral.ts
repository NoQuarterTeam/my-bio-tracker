import { Mistral } from "@mistralai/mistralai"
import { env } from "./env"

export const mistral = new Mistral({ apiKey: env.MISTRAL_API_KEY })
