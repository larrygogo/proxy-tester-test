import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Trans, useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

export default function Page() {
  const { concurrency, setConcurrency } = useContext(ProxyTaskContext)
  const platformInfo = usePlatformInfo()
  const {
    i18n: { changeLanguage, language },
  } = useTranslation()

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader className="flex flex-row justify-between space-y-0 bg-gray-50 p-4 border-b">
        <CardTitle className="text-2xl">
          <Trans i18nKey="setting.title">Setting</Trans>
        </CardTitle>
        <Tooltip>
          <TooltipTrigger>
            <Button asChild variant="ghost" size="icon">
              <Link to="/">
                <X size={16} />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <Trans i18nKey="setting.close">Close</Trans>
          </TooltipContent>
        </Tooltip>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div className="h-full flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <Trans i18nKey="setting.concurrency">Concurrency</Trans>
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={16} className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <Trans i18nKey="setting.concurrency.tooltip">
                      The count of concurrency to task (Default: 20)
                    </Trans>
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
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <Trans i18nKey="setting.language">Language</Trans>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={language}
                  onValueChange={(v) => {
                    changeLanguage(v)
                    localStorage.setItem("setting.locale", v)
                  }}
                >
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zh">简体中文</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm text-gray-800">
              <Trans i18nKey="setting.about">About</Trans>
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
