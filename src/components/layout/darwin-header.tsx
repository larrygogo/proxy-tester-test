import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {HelpCircle, Settings} from "lucide-react";

export default function DarwinHeader() {
  return (
    <div
      data-tauri-drag-region="true"
      className={cn("pl-16 flex items-center")}>
      <div
        data-tauri-drag-region="true"
        className={cn(
        "py-1 text-center text-zinc-700 font-semibold font-sans text-sm",
        "select-none cursor-default",
      )}>
        Proxy Tester
      </div>
      <div className="ml-auto flex gap-1 ">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={'/dashboard/setting'}
              className={cn("text-gray-600 p-1 hover:bg-white/50 rounded")}
            >
              <Settings className="w-4 h-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            Setting
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger className={cn("text-gray-600 p-1 hover:bg-white/50 rounded")}>
            <HelpCircle className="w-4 h-4" />
          </TooltipTrigger>
          <TooltipContent>
            Help
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}