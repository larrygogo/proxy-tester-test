import Link from "next/link";
import {cn} from "@/lib/utils";
import {HelpCircle, Settings} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";

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
        <TooltipProvider>
        {/*<Tooltip>*/}
        {/*  <TooltipTrigger asChild>*/}
        {/*    <Button variant="ghost" asChild size="icon" className="h-6 w-6 bg-opacity-80" >*/}
        {/*      <Link href="/dashboard/setting">*/}
        {/*      <Settings size={16} className="w-4 h-4"/>*/}
        {/*      </Link>*/}
        {/*    </Button>*/}
        {/*  </TooltipTrigger>*/}
        {/*  <TooltipContent>*/}
        {/*    Settings*/}
        {/*  </TooltipContent>*/}
        {/*</Tooltip>*/}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 bg-opacity-80" >
              <HelpCircle size={16} className="w-4 h-4"/>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Help
          </TooltipContent>
        </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}