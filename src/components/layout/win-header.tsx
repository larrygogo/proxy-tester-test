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
    const handleChangeMaximize = () => {
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
  }, [closeRef, isMaximized, maximizeRef, minimizeRef])

  return (
    <div
      data-tauri-drag-region="true"
      className="flex w-full items-center justify-between"
    >
      <div
        data-tauri-drag-region="true"
        className="pointer-events-none py-2 cursor-default select-none px-4 text-center font-sans text-sm font-semibold text-[#0F2B46]"
      >
        Proxy Tester
      </div>
      <div className="flex items-center justify-end pb-1">
        <button
          type="button"
          title={t("app.minimize")}
          ref={minimizeRef}
          className="p-2 hover:bg-gray-50"
        >
          <Minus size={16} />
        </button>
        <button
          type="button"
          title={isMaximized ? t("app.unmaximize") : t("app.maximize")}
          ref={maximizeRef}
          className="p-2 hover:bg-gray-50"
        >
          <Square size={14} />
        </button>
        <button
          type="button"
          title={t("app.close")}
          ref={closeRef}
          className="p-2 hover:bg-red-600 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
