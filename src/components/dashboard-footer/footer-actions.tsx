import { ProxyTaskContext, TASK_STATUS_ENUM } from "@/context/ProxyTaskContext"
import { fs, clipboard, dialog, notification } from "@tauri-apps/api"
import { cva } from "class-variance-authority"
import { CircleCheck, Copy, Download, Eraser } from "lucide-react"
import { useContext, useEffect, useMemo, useState } from "react"
import { Trans, useTranslation } from "react-i18next"

const footerButtonVariants = cva(
  "flex h-6 items-center gap-1 px-2 transition-all duration-200",
  {
    variants: {
      rounded: {
        none: "",
        left: "rounded-l-md",
        right: "rounded-r-md",
        full: "rounded-md",
      },
      state: {
        default:
          "transition-all duration-200 hover:bg-gray-300 disabled:opacity-50",
        success: "bg-green-200",
      },
    },
    defaultVariants: {
      rounded: "none",
      state: "default",
    },
  },
)

export default function FooterActions() {
  const { t } = useTranslation()
  const [isCleared, setIsCleared] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const { taskStatus, proxyStates, setProxyStates } =
    useContext(ProxyTaskContext)

  const usableData = useMemo(() => {
    return proxyStates
      ?.filter((item) => item.status?.toUpperCase() === "OK")
      .map(
        (item) =>
          `${item.host}:${String(item.port)}${
            item.username && item.password
              ? `:${item.username}:${item.password}`
              : ""
          }`,
      )
      .join("\n")
  }, [proxyStates])

  const unUsableData = useMemo(() => {
    return proxyStates
      ?.filter((item) => item.status && item.status.toUpperCase() !== "OK")
      .map(
        (item) =>
          `${item.host}:${String(item.port)}${
            item.username && item.password
              ? `:${item.username}:${item.password}`
              : ""
          }`,
      )
      .join("\n")
  }, [proxyStates])

  const handleClearUnusable = () => {
    setProxyStates?.(
      proxyStates?.filter(
        (item) => !item.status || item.status.toUpperCase() === "OK",
      ) ?? [],
    )
    setIsCleared(true)
  }

  const handleCopyUsable = () => {
    if (!usableData) return
    void clipboard.writeText(usableData).then(() => {
      setIsCopied(true)
    })
  }

  const handleExportUsable = async () => {
    if (!usableData) return
    const result = await dialog.save({
      defaultPath: "proxy.txt",
      filters: [{ name: "Text", extensions: ["txt"] }],
    })
    if (result) {
      await fs.writeFile({
        path: result,
        contents: usableData,
      })
      let permissionGranted = await notification.isPermissionGranted()
      if (!permissionGranted) {
        const permission = await notification.requestPermission()
        permissionGranted = permission === "granted"
      }
      if (permissionGranted) {
        notification.sendNotification({
          title: t("home.task.list.exportUsable.notification.title", {
            defaultValue: "Export Usable",
          }),
          body: t("home.task.list.exportUsable.notification.body", {
            defaultValue: "The usable proxies has been exported.",
            count: usableData.split("\n").length,
          }),
        })
      }
    }
  }

  useEffect(() => {
    if (isCleared) {
      const timer = setTimeout(() => {
        setIsCleared(false)
      }, 1000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [isCleared])

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false)
      }, 1000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [isCopied])
  console.log("unUsableData", unUsableData)
  return (
    <div className="flex items-center divide-x">
      <div>
        <button
          type="button"
          disabled={
            !unUsableData ||
            unUsableData.length === 0 ||
            taskStatus === TASK_STATUS_ENUM.RUNNING
          }
          className={footerButtonVariants({
            rounded: "full",
            state: isCleared ? "success" : "default",
          })}
          onClick={handleClearUnusable}
        >
          {isCleared ? <CircleCheck size={12} /> : <Eraser size={12} />}
          <Trans i18nKey="home.task.list.clearUnusable">Clear Unusable</Trans>
        </button>
      </div>
      <div>
        <button
          type="button"
          disabled={!usableData || taskStatus === TASK_STATUS_ENUM.RUNNING}
          className={footerButtonVariants({
            rounded: "full",
            state: isCopied ? "success" : "default",
          })}
          onClick={handleCopyUsable}
        >
          {isCopied ? <CircleCheck size={12} /> : <Copy size={12} />}
          <Trans i18nKey="home.task.list.copyUsable">Copy Usable</Trans>
        </button>
      </div>
      <div>
        <button
          type="button"
          disabled={!usableData || taskStatus === TASK_STATUS_ENUM.RUNNING}
          className={footerButtonVariants({
            rounded: "full",
          })}
          onClick={() => void handleExportUsable()}
        >
          <Download size={12} />
          <Trans i18nKey="home.task.list.exportUsable">Export Usable</Trans>
        </button>
      </div>
    </div>
  )
}
