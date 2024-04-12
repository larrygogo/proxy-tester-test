import { appWindow } from "@tauri-apps/api/window"
import { Minus, Square, X } from "lucide-react"
import { createRef, useEffect } from "react"

export function WinHeader() {
  const minimizeRef = createRef<HTMLButtonElement>()
  const maximizeRef = createRef<HTMLButtonElement>()
  const closeRef = createRef<HTMLButtonElement>()

  useEffect(() => {
    minimizeRef.current?.addEventListener(
      "click",
      () => void appWindow.minimize(),
    )
    maximizeRef.current?.addEventListener(
      "click",
      () => void appWindow.toggleMaximize(),
    )
    closeRef.current?.addEventListener("click", () => void appWindow.close())
  }, [closeRef, maximizeRef, minimizeRef])

  return (
    <div
      data-tauri-drag-region="true"
      className="flex w-full items-center justify-between"
    >
      <div
        data-tauri-drag-region="true"
        className="pointer-events-none cursor-default select-none px-4 text-center font-sans text-sm font-semibold text-[#0F2B46]"
      >
        Proxy Tester
      </div>
      <div className="flex items-center justify-end pb-1">
        <button
          type="button"
          title="最小化"
          ref={minimizeRef}
          className="px-2 py-1 hover:bg-gray-50"
        >
          <Minus size={16} />
        </button>
        <button
          type="button"
          title="最大化"
          ref={maximizeRef}
          className="px-2 py-1 hover:bg-gray-50"
        >
          <Square size={14} />
        </button>
        <button
          type="button"
          title="关闭"
          ref={closeRef}
          className="px-2 py-1 hover:bg-red-600 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
