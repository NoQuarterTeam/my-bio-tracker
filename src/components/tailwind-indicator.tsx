import { isDevelopment } from "@/lib/env"

export function TailwindIndicator() {
  if (!isDevelopment) return null
  return (
    <div className="fixed right-1 bottom-1 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 p-3 font-mono text-white text-xs">
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden">sm</div>
      <div className="hidden md:block lg:hidden">md</div>
      <div className="hidden lg:block xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  )
}
