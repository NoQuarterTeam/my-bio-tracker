export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with Next.js, Drizzle, and shadcn/ui. The source code is available on{" "}
          <a href="#" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  )
}

