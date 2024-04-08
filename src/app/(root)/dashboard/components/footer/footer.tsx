import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {cn} from "@/lib/utils";
import {ProxyTaskContext, TASK_STATUS_ENUM} from "@/context/ProxyTaskContext";
import FooterActions from "@/app/(root)/dashboard/components/footer/footer-actions";
import {useContext} from "react";
import {BadgeCheck, BadgeX, ListMinus} from "lucide-react";

export default function Footer() {
  const {taskStatus, proxyStates} = useContext(ProxyTaskContext)
  const isRunning = TASK_STATUS_ENUM.RUNNING === taskStatus

  return (
    <footer className="flex select-none border-t bg-gray-100 p-2">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger className="flex items-center gap-2">
              <div className="relative flex h-2 w-2">
                <div className={cn(
                  "absolute inline-flex h-full w-full rounded-full bg-green-500",
                  isRunning ? 'animate-ping bg-green-500' : 'bg-gray-300'
                )}/>
                <div className={cn(
                  "relative inline-flex h-2 w-2 rounded-full bg-green-500",
                  isRunning ? 'bg-green-500' : 'bg-gray-300'
                )}/>
              </div>
              <span>{TASK_STATUS_ENUM.RUNNING === taskStatus ? '运行' : '空闲'}</span>
            </TooltipTrigger>
            <TooltipContent>
              当前状态
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <div className="ml-2 flex items-center gap-1 text-gray-400">
                <ListMinus className="fill-red-100" size={12}/>
                <span>{proxyStates?.filter((item) => !item.status).length}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              待执行
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <div className="ml-2 flex items-center gap-1 text-gray-400">
                <BadgeCheck className="fill-green-100" size={12}/>
                <span>{proxyStates?.filter((item) => item.status && item.status.toUpperCase() === 'OK').length}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              可用数量
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <div className="ml-2 flex items-center gap-1 text-gray-400">
                <BadgeX className="fill-red-100" size={12}/>
                <span>{proxyStates?.filter((item) => item.status && item.status.toUpperCase() !== 'OK').length}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              不可用数量
            </TooltipContent>
          </Tooltip>
        </div>
        <FooterActions/>
      </div>
    </footer>
  )
}