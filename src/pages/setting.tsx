import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ProxyTaskContext } from "@/context/ProxyTaskContext"
import { usePlatformInfo } from "@/hooks/use-platform-info"
import { Info, X } from "lucide-react"
import { useContext } from "react"
import { Link } from "react-router-dom"

export default function Page() {
  const { concurrency, setConcurrency } = useContext(ProxyTaskContext)
  const platformInfo = usePlatformInfo()

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader className="flex flex-row justify-between space-y-0 bg-gray-50 p-4">
        <CardTitle className="text-2xl">设置</CardTitle>
        <Button asChild size="icon" variant="ghost">
          <Link to={"/"}>
            <X className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div className="h-full flex flex-col justify-between gap-4">
          <div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <span>并发数</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={16} className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    同时测试代理的条数，并不是越高越好，默认：20
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <Slider
                  className="max-w-xs"
                  value={[concurrency ?? 20]}
                  onValueChange={(v) => {
                    setConcurrency?.(v[0])
                  }}
                  min={1}
                  max={50}
                />
                <div className="w-12 text-center text-sm">{concurrency}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm text-gray-800">
              <span>关于</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex gap-1 text-sm">
                <span className="font-bold text-zinc-800">OS</span>
                <span>
                  {platformInfo.os} {platformInfo.kernalVersion}{" "}
                  {platformInfo.arch}
                </span>
              </div>
              <span className="text-xs">/</span>
              <div className="flex gap-1 text-sm">
                <span className="font-bold text-zinc-800">Tauri</span>
                <span>{platformInfo.tauriVersion}</span>
              </div>
              <span className="text-xs">/</span>
              <div className="flex gap-1 text-sm">
                <span className="font-bold text-zinc-800">App</span>
                <span>{platformInfo.appVersion}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
