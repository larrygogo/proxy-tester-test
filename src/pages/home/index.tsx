import {
  ChevronDown,
  HelpCircle,
  Loader,
  Plus,
  Rocket,
  Settings,
} from "lucide-react"
import { useContext, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import ProxyEditDialog from "@/components/proxy-edit-dialog"
import {
  PROXY_PROTOCOL_ENUM,
  type ProxyProtocol,
  ProxyTaskContext,
} from "@/context/ProxyTaskContext"

import InterparkQueueTaskDialog from "@/components/interpark-queue-task-dialog"
import Footer from "@/components/layout/dashboard-footer/footer"
import ProxyTable from "@/components/proxy-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { protocolAtom, targetAtom } from "@/lib/jotai"
import { cn } from "@/lib/utils"
import { useAtom } from "jotai"
import { nanoid } from "nanoid"
import { Trans, useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

const protocolOptions = Object.entries(PROXY_PROTOCOL_ENUM).map(
  ([value, label]) => ({
    label,
    value,
  }),
)

export default function Page() {
  const { t } = useTranslation()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [protocol, setProtocol] = useAtom(protocolAtom)
  const [target, setTarget] = useAtom(targetAtom)
  const [interparkQueueDialogOpen, setInterparkQueueDialogOpen] =
    useState(false)
  const {
    isRunning,
    proxyStates,
    setProxyStates,
    startTaskWithMode,
    stopTask,
    taskMode,
  } = useContext(ProxyTaskContext)

  const handleClick = () => {
    if (isRunning) {
      stopTask?.()
    } else {
      const targetURL = target || "www.google.com"
      setTarget(targetURL)
      const newProxyStates =
        proxyStates?.map((proxy) => ({
          ...proxy,
          id: nanoid(),
          status: undefined,
          delay: undefined,
        })) ?? []
      setProxyStates?.(newProxyStates)
      startTaskWithMode?.({
        mode: "normal",
        states: newProxyStates,
        target: targetURL,
        protocol,
      })
    }
  }

  const handleTestInterpark = () => {
    const newProxyStates =
      proxyStates?.map((proxy) => ({
        ...proxy,
        id: nanoid(),
        status: undefined,
        delay: undefined,
      })) ?? []
    setProxyStates?.(newProxyStates)
    startTaskWithMode?.({
      mode: "test_interpark_global_index",
      protocol,
      states: newProxyStates,
    })
  }

  const handleTestMelon = () => {
    const newProxyStates =
      proxyStates?.map((proxy) => ({
        ...proxy,
        id: nanoid(),
        status: undefined,
        delay: undefined,
      })) ?? []
    setProxyStates?.(newProxyStates)
    startTaskWithMode?.({
      mode: "test_melon_global_index",
      protocol,
      states: newProxyStates,
    })
  }

  return (
    <Card className="flex-1 flex h-full flex-col overflow-hidden text-xs shadow-sm">
      <CardHeader
        className={cn(
          "h-16 p-4 border-b",
          isRunning ? "bg-gray-100" : "bg-gray-50",
        )}
      >
        <div className="flex gap-2">
          <Select
            disabled={isRunning}
            value={protocol}
            onValueChange={(v) => setProtocol?.(v as ProxyProtocol)}
          >
            <SelectTrigger className="w-52 select-none focus-visible:ring-0 disabled:bg-gray-200 disabled:opacity-100 disabled:cursor-default disabled:select-none disabled:text-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {protocolOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            disabled={isRunning}
            value={
              taskMode !== "normal" && isRunning
                ? `${t("home.task.professionalMode", {
                    defaultValue: "Professional Mode",
                  })}：${taskMode ?? ""}`
                : target
            }
            className="w-full bg-transparent px-3 py-1 outline-none focus-visible:ring-0 disabled:bg-gray-200 disabled:opacity-100 disabled:cursor-default disabled:select-none disabled:text-gray-700"
            placeholder={t("home.task.target")}
            onChange={(e) => setTarget?.(e.target.value)}
          />
          <div className="flex divide-x divide-gray-700">
            <Button
              color="primary"
              className="select-none items-center gap-1 rounded-r-none"
              onClick={handleClick}
            >
              {isRunning ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                <Rocket className="size-4" />
              )}
              {isRunning ? (
                <Trans i18nKey="home.task.stop">Stop</Trans>
              ) : (
                <Trans i18nKey="home.task.start">Test</Trans>
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={isRunning}
                  className="rounded-l-none px-1 outline-none focus-visible:ring-0 disabled:bg-zinc-600 disabled:opacity-100"
                >
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="flex items-center gap-1">
                  <Trans i18nKey="home.task.professionalMode">
                    Professional Mode
                  </Trans>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle size={16} />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <Trans i18nKey="home.task.professionalMode.tooltip">
                        Test specific scenarios for specialized websites
                      </Trans>
                    </TooltipContent>
                  </Tooltip>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleTestInterpark}>
                  <Trans i18nKey="home.task.professionalMode.interpark">
                    Interpark
                  </Trans>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setInterparkQueueDialogOpen(true)
                  }}
                >
                  <Trans i18nKey="home.task.professionalMode.interparkQueue">
                    Interpark Queue
                  </Trans>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTestMelon}>
                  <Trans i18nKey="home.task.professionalMode.melon">
                    Melon
                  </Trans>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Separator orientation="vertical" />
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger disabled={isRunning} asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setEditDialogOpen(true)
                  }}
                >
                  <Plus size={16} className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <Trans i18nKey="home.editProxyDialog.tooltip">
                  Edit Proxy List
                </Trans>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={isRunning}
                  asChild={!isRunning}
                  size="icon"
                  variant="ghost"
                >
                  <Link to={"/setting"}>
                    <Settings size={16} className="size-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <Trans i18nKey="home.setting.tooltip">Setting</Trans>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="flex h-full flex-col">
          <ProxyTable proxyStates={proxyStates ?? []} />
          <Footer />
        </div>
      </CardContent>
      <ProxyEditDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} />
      <InterparkQueueTaskDialog
        open={interparkQueueDialogOpen}
        onOpenChange={setInterparkQueueDialogOpen}
        onFinish={({ sku }) => {
          const newProxyStates =
            proxyStates?.map((state) => ({
              ...state,
              id: nanoid(),
              status: undefined,
              delay: undefined,
            })) ?? []
          setProxyStates?.(newProxyStates)
          startTaskWithMode?.({
            mode: "test_interpark_global_queue",
            states: newProxyStates,
            protocol,
            config: {
              sku,
            },
          })
          return true
        }}
      />
    </Card>
  )
}
