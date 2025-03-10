"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { type Message as AiMessage, useChat } from "@ai-sdk/react"
import { motion } from "framer-motion"
import { ChevronRightIcon, SendIcon, SparklesIcon, SquareIcon } from "lucide-react"
import { memo, useRef, useState } from "react"
import remarkGfm from "remark-gfm"
import { MemoizedReactMarkdown } from "../components/markdown"

export function Chat() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, input, handleInputChange, handleSubmit, stop, status } = useChat({
    api: "/admin/api",
    onResponse: () => {
      setIsSubmitted(false)
    },
  })

  const isLoading = status === "submitted"

  return (
    <div className="flex h-dvh flex-col p-8">
      <div className="mb-4">
        <h1 className="font-bold text-3xl">Explore the database</h1>
        <p className="text-muted-foreground">Ask questions and get AI-powered insights.</p>
      </div>

      {/* Messages Area */}
      <div className="scrollbar-hide mx-auto w-full max-w-3xl flex-1 overflow-y-auto bg-background p-4 pb-[100px]">
        <div className="w-full space-y-6 ">
          {messages.map((message, index) => (
            <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "flex max-w-[80%] items-start gap-3",
                  message.role === "user" && "rounded-xl bg-black px-3 py-2 dark:bg-white",
                )}
              >
                {message.role === "assistant" && (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full ring-1 ring-border">
                    <SparklesIcon size={14} />
                  </div>
                )}

                {message.role === "user" ? (
                  <p className="text-white dark:text-black">{message.content}</p>
                ) : (
                  <div className={cn("space-y-2", messages.length === index + 1 && "min-h-[calc(100vh-34rem)]")}>
                    {message.parts?.map((part, index) => (
                      <MessagePart key={index} part={part} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {(isSubmitted || (isLoading && messages.length > 0 && messages[messages.length - 1]?.role === "user")) && (
            <div className="min-h-[calc(100vh-34rem)]">
              <ThinkingMessage />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 mx-auto w-full max-w-3xl">
        <form
          className="relative block"
          onSubmit={(e) => {
            setIsSubmitted(true)
            handleSubmit(e)
          }}
        >
          <textarea
            placeholder="Ask any question..."
            value={input}
            onChange={handleInputChange}
            rows={1}
            className="dark:!outline-none focus:!ring-offset-transparent dark:!ring-white !ring-black !border-gray-200 dark:!border-gray-700 m-0 w-full resize-none rounded-3xl border bg-accent px-4 pt-4 pb-12 outline-none focus:outline-none focus:ring-1 focus:ring-offset-1 dark:active:ring-white dark:focus:ring-white"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                if (input.trim()) {
                  setIsSubmitted(true)
                  handleSubmit(e as any)
                }
              }
            }}
          />
          <div className="absolute right-2 bottom-3.5 flex items-center justify-between">
            {status === "streaming" || status === "submitted" ? (
              <Button type="button" variant="default" size="icon" aria-label="Stop" onClick={stop} className="rounded-full">
                <SquareIcon className=" fill-white text-white" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="default"
                size="icon"
                aria-label="Send message"
                isLoading={isLoading}
                className="rounded-full"
                disabled={!input.trim() || isLoading}
              >
                <SendIcon className="size-4" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

const MessagePart = memo(function _Message({ part }: { part: NonNullable<AiMessage["parts"]>[number] }) {
  const partType = part.type
  switch (partType) {
    case "reasoning":
    case "source":
      return null
    case "text": {
      return (
        <div className="prose dark:prose-invert !max-w-full !text-black dark:!text-white space-y-2 overflow-x-auto break-words">
          <MemoizedReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ node: _, ...props }) => (
                <div className="overflow-x-auto rounded-sm border">
                  <table
                    className={cn(
                      props.className,
                      "w-full table-auto text-left text-gray-500 text-sm rtl:text-right dark:text-gray-400",
                    )}
                    {...props}
                  />
                </div>
              ),
              thead: ({ node: _, ...props }) => (
                <thead
                  className={cn(
                    props.className,
                    "bg-gray-50 text-gray-700 text-xs uppercase dark:bg-gray-700 dark:text-gray-400",
                  )}
                  {...props}
                />
              ),
              th: ({ node: _, ...props }) => (
                <th className={cn(props.className, "whitespace-nowrap px-6 py-3 text-center")} {...props} />
              ),
              tr: ({ node: _, ...props }) => (
                <tr
                  className={cn(props.className, "border-gray-200 border-b bg-white dark:border-gray-700 dark:bg-gray-800")}
                  {...props}
                />
              ),
            }}
          >
            {part.text}
          </MemoizedReactMarkdown>
        </div>
      )
    }
    case "tool-invocation": {
      const toolName = part.toolInvocation.toolName as "queryDatabase"
      switch (toolName) {
        case "queryDatabase": {
          const toolState = part.toolInvocation.state
          switch (toolState) {
            case "call":
            case "partial-call":
              return <p>Generating query...</p>
            case "result": {
              const query = part.toolInvocation.args?.query
              return <QueryDetails query={query} />
            }
            default: {
              toolState satisfies never
              return null
            }
          }
        }
        default: {
          toolName satisfies never
          return null
        }
      }
    }
    default:
      partType satisfies never
      return null
  }
})

const QueryDetails = memo(function _QueryDetails({ query }: { query: string }) {
  return (
    <details key="a" className="w-[500px] overflow-hidden rounded-xl border [&_svg]:open:rotate-90">
      <summary className="flex w-full cursor-pointer items-center gap-2 bg-gray-50 px-3 py-2 font-medium text-sm dark:bg-gray-800 [&::-webkit-details-marker]:hidden">
        <ChevronRightIcon className="size-4" /> <span>View SQL query</span>
      </summary>
      <div className="bg-gray-100 p-4 dark:bg-gray-900">
        <code className="whitespace-pre-wrap text-sm">{query}</code>
      </div>
    </details>
  )
})

function ThinkingMessage() {
  const role = "assistant"

  return (
    <motion.div
      className="group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cn(
          "flex w-full gap-3 rounded-xl group-data-[role=user]/message:ml-auto group-data-[role=user]/message:w-fit group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:bg-muted group-data-[role=user]/message:px-3 group-data-[role=user]/message:py-2",
        )}
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full ring-1 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex w-full flex-col gap-2">
          <div className="flex flex-col gap-4 text-muted-foreground">Thinking...</div>
        </div>
      </div>
    </motion.div>
  )
}
