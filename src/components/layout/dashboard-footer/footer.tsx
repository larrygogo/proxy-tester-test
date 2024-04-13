import FooterActions from "@/components/layout/dashboard-footer/footer-actions"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ProxyTaskContext, TASK_STATUS_ENUM } from "@/context/ProxyTaskContext"
import { cn } from "@/lib/utils"
import { BadgeCheck, BadgeX, ListMinus } from "lucide-react"
import { useContext } from "react"
import { Trans } from "react-i18next"

export default function Footer() {
  const { taskStatus, proxyStates } = useContext(ProxyTaskContext)
  const isRunning = TASK_STATUS_ENUM.RUNNING === taskStatus

  return (
    <footer className="flex select-none border-t bg-gray-100 p-2">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger className="flex items-center gap-2">
              <div className="relative flex size-2">
                <div
                  className={cn(
                    "absolute inline-flex size-full rounded-full bg-green-500",
                    isRunning ? "animate-ping bg-green-500" : "bg-gray-300",
                  )}
                />
                <div
                  className={cn(
                    "relative inline-flex size-2 rounded-full bg-green-500",
                    isRunning ? "bg-green-500" : "bg-gray-300",
                  )}
                />
              </div>
              <span>
                {TASK_STATUS_ENUM.RUNNING === taskStatus ? (
                  <Trans i18nKey="home.task.status.running">Running</Trans>
                ) : (
                  <Trans i18nKey="home.task.status.pending">Pending</Trans>
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <Trans i18nKey="home.task.status.tooltip">Task status</Trans>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <div className="ml-2 flex items-center gap-1 text-gray-400">
                <ListMinus className="fill-red-100" size={12} />
                <span>
                  {proxyStates?.filter((item) => !item.status).length}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <Trans i18nKey="home.task.statistic.undone">Undone count</Trans>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <div className="ml-2 flex items-center gap-1 text-gray-400">
                <BadgeCheck className="fill-green-100" size={12} />
                <span>
                  {
                    proxyStates?.filter(
                      (item) =>
                        item.status && item.status.toUpperCase() === "OK",
                    ).length
                  }
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <Trans i18nKey="home.task.statistic.usable">Usable count</Trans>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <div className="ml-2 flex items-center gap-1 text-gray-400">
                <BadgeX className="fill-red-100" size={12} />
                <span>
                  {
                    proxyStates?.filter(
                      (item) =>
                        item.status && item.status.toUpperCase() !== "OK",
                    ).length
                  }
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <Trans i18nKey="home.task.statistic.unusable">
                Unusable count
              </Trans>
            </TooltipContent>
          </Tooltip>
        </div>
        <FooterActions />
      </div>
    </footer>
  )
}
