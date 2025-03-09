import { LoopsClient } from "loops"
import { after } from "next/server"
import { env } from "./env"

export const loops = new LoopsClient(env.LOOPS_API_KEY)

const EmailTemplate = {
  ForgotPassword: "cm81xwkor04cus08y8dxynjdp",
}

export async function sendEmail(template: keyof typeof EmailTemplate, to: string, data: Record<string, string>) {
  after(async () => {
    try {
      await loops.sendTransactionalEmail({
        transactionalId: EmailTemplate[template],
        email: to,
        dataVariables: data,
      })
    } catch (error) {
      console.log(error)
    }
  })
}
