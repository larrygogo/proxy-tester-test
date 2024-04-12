import GlobalHeader from "@/components/layout/global-header"
import { cn } from "@/lib/utils"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-tauri-drag-region={true}
      suppressHydrationWarning
      className={cn(
        "flex h-screen text-md flex-col font-sans bg-gradient-to-br from-[#0F2B4622] from-10% via-[#0F2B4655] via-20% to-[#0F2B4622] to-90%",
        // fontMono.variable,
      )}
    >
      <GlobalHeader />
      <main className="flex flex-col px-2 pb-2 flex-1 overflow-clip">
        {children}
      </main>
    </div>
  )
}
