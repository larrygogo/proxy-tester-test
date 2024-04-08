import {CircleCheck, Copy, Download, Eraser} from "lucide-react";
import {useContext, useEffect, useMemo, useState} from "react";
import {ProxyTaskContext, TASK_STATUS_ENUM} from "@/context/ProxyTaskContext";
import {cva} from "class-variance-authority";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

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
        default: "transition-all duration-200 hover:bg-gray-300 disabled:opacity-50",
        success: "bg-green-200",
      }
    },
    defaultVariants: {
      rounded: "none",
      state: "default",
    },
  }
)

export default function FooterActions() {
  const [isCleared, setIsCleared] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const {taskStatus, proxyStates, setProxyStates} = useContext(ProxyTaskContext)

  const usableData = useMemo(() => {
    return proxyStates?.filter((item) => item.status?.toUpperCase() === 'OK').map((item) => `${item.host}:${item.port}${item.username ? `:${item.username}:${item.password}` : ''}`).join('\n')
  }, [proxyStates])

  const unUsableData = useMemo(() => {
    return proxyStates?.filter((item) => item.status && item.status?.toUpperCase() !== 'OK').map((item) => `${item.host}:${item.port}${item.username ? `:${item.username}:${item.password}` : ''}`).join('\n')
  }, [proxyStates])

  const handleClearUnusable = async () => {
    setProxyStates?.(proxyStates?.filter((item) => !item.status || item.status?.toUpperCase() === 'OK') ?? [])
    setIsCleared(true)
  }

  const handleCopyUsable = async () => {
    if (!usableData) return
    const {writeText} = await import("@tauri-apps/api/clipboard")
    await writeText(usableData)
    setIsCopied(true)
  }

  const handleExportUsable = async () => {
    if (!usableData) return
    // 选则文件保存路径
    const dialog = await import("@tauri-apps/api/dialog")
    const result = await dialog.save({
      defaultPath: 'proxy.txt',
      filters: [{name: 'Text', extensions: ['txt']}]
    })
    if (result) {
      const fs = await import("@tauri-apps/api/fs")
      await fs.writeFile({
        path: result,
        contents: usableData
      })
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
  }, [isCleared]);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false)
      }, 1000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [isCopied]);
  console.log('unUsableData', unUsableData)
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            disabled={!unUsableData || unUsableData?.length === 0 || taskStatus === TASK_STATUS_ENUM.RUNNING}
            className={footerButtonVariants({
              rounded: 'full',
              state: isCleared ? 'success' : 'default',
            })}
            onClick={handleClearUnusable}>
            {isCleared ? <CircleCheck size={12}/> : <Eraser size={12}/> }
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <div>清除不可用</div>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            disabled={!usableData || taskStatus === TASK_STATUS_ENUM.RUNNING}
            className={footerButtonVariants({
              rounded: 'full',
              state: isCopied ? 'success' : 'default',
            })}
            onClick={handleCopyUsable}>
            {isCopied ? <CircleCheck size={12}/> : <Copy size={12}/>}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <div>复制可用</div>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            disabled={!usableData || taskStatus === TASK_STATUS_ENUM.RUNNING}
            className={footerButtonVariants({
              rounded: 'full',
            })}
            onClick={handleExportUsable}>
            <Download size={12}/>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <div>导出可用(.txt)</div>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}