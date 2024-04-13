import { appWindow } from "@tauri-apps/api/window"
import { Minus, Square, X } from "lucide-react"
import { createRef, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export function WinHeader() {
  const minimizeRef = createRef<HTMLButtonElement>()
  const maximizeRef = createRef<HTMLButtonElement>()
  const closeRef = createRef<HTMLButtonElement>()
  const [isMaximized, setIsMaximized] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const handleMinimize = () => void appWindow.minimize()
    const handleChangeMaximize = async () => {
      const isMaximized = await appWindow.isMaximized()
      if (isMaximized) {
        setIsMaximized(false)
        void appWindow.unmaximize()
      } else {
        setIsMaximized(true)
        void appWindow.maximize()
      }
    }

    const handleClose = () => void appWindow.close()

    minimizeRef.current?.addEventListener("click", handleMinimize)
    maximizeRef.current?.addEventListener("click", handleChangeMaximize)
    closeRef.current?.addEventListener("click", handleClose)

    return () => {
      minimizeRef.current?.removeEventListener("click", handleMinimize)
      maximizeRef.current?.removeEventListener("click", handleChangeMaximize)
      closeRef.current?.removeEventListener("click", handleClose)
    }
  }, [closeRef, maximizeRef, minimizeRef])

  return (
    <div
      data-tauri-drag-region="true"
      className="relative flex w-full justify-between"
    >
      <div className="absolute top-0 w-full h-[6px] z-10 cursor-ns-resize" />
      <div
        data-tauri-drag-region="true"
        className="pointer-events-none pb-2 mt-2 cursor-default select-none px-4 text-center font-sans text-sm font-semibold text-[#0F2B46]"
      >
        Proxy Tester
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          title={t("app.minimize")}
          ref={minimizeRef}
          className="py-2 px-3 hover:bg-gray-400"
        >
          <Minus size={16} />
        </button>
        <button
          type="button"
          title={isMaximized ? t("app.unmaximize") : t("app.maximize")}
          ref={maximizeRef}
          className="py-2 px-3 hover:bg-gray-400"
        >
          <Square size={14} />
        </button>
        <button
          type="button"
          title={t("app.close")}
          ref={closeRef}
          className="py-2 px-3 hover:bg-red-600 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
