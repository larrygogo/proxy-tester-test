import GlobalHeader from "@/components/layout/global-header"
import { fontMono, fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-tauri-drag-region={true}
      suppressHydrationWarning
      className={cn(
        "flex h-screen text-md flex-col font-sans bg-gradient-to-br from-[#d1e0f7] from-10% via-[#d7e0ff] via-50% to-[#d1e0f7] to-90%",
        fontMono.variable,
      )}
    >
      <style global>
        {`
          body {
            font-family: ${fontSans.style.fontFamily};
          }
        `}
      </style>
      <GlobalHeader />
      <main className="flex flex-col px-2 pb-2 flex-1 overflow-clip">
        {children}
      </main>
    </div>
  )
}
