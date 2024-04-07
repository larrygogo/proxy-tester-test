import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {ChevronUp, CircleCheck, Copy, Download} from "lucide-react";
import {useContext, useEffect, useMemo, useState} from "react";
import {ProxyTaskContext} from "@/context/ProxyTaskContext";

export default function CopyDownloadButton() {
  const [isCopied, setIsCopied] = useState(false)
  const {taskStatus, proxyStates} = useContext(ProxyTaskContext)
  const [open, setOpen] = useState(false)

  const usableData = useMemo(() => {
    return proxyStates?.filter((item) => item.status?.toUpperCase() === 'OK').map((item) => `${item.host}:${item.port}${item.username ? `:${item.username}:${item.password}` : ''}`).join('\n')
  }, [proxyStates])

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false)
      }, 5000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [isCopied]);
  return (
    <div className="flex items-center">
      {isCopied ? (
        <button
          className="flex h-6 items-center gap-1 rounded-md rounded-r-none bg-green-200 px-2 transition-all duration-200">
          <CircleCheck size={12}/>
          复制成功
        </button>
      ) : (
        <button
          disabled={!usableData}
          className="flex h-6 items-center gap-1 rounded-md rounded-r-none bg-gray-200 px-2 transition-all duration-200 hover:bg-gray-300 disabled:opacity-50"
          onClick={async () => {
            if (!usableData) return
            const {writeText} = await import("@tauri-apps/api/clipboard")
            await writeText(usableData)
            setIsCopied(true)
          }}>
          <Copy size={12}/>
          复制可用
        </button>
      )}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild disabled={!usableData}>
          <button
            className="h-6 rounded-r-md border-l border-gray-300 bg-gray-200 p-1 transition-all duration-200 hover:bg-gray-300 disabled:opacity-50">
            <ChevronUp size={14}/>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="flex h-6 gap-1 text-xs" onSelect={async () => {
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
          }}>
            <Download size={12}/>
            导出文件 (.txt)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}