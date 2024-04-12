import { cn } from "@/lib/utils"

export default function DarwinHeader() {
  return (
    <div
      data-tauri-drag-region="true"
      className={cn("flex items-center pl-16")}
    >
      <div
        data-tauri-drag-region="true"
        className={cn(
          "cursor-default select-none py-1 text-center font-sans text-sm font-bold text-[#0F2B46]",
        )}
      >
        Proxy Tester
      </div>
    </div>
  )
}
