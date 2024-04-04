import {cn} from "@/lib/utils";

export default function DarwinHeader() {

  // const handleHelp = () => {
  //   import("@tauri-apps/api").then(({window}) => {
  //     new window.WebviewWindow("help", {
  //       title: 'Help',
  //       url: '/help',
  //     })
  //   })
  // }

  return (
    <div
      data-tauri-drag-region="true"
      className={cn("flex items-center pl-16")}>
      <div
        data-tauri-drag-region="true"
        className={cn(
          "py-1 text-center font-sans text-sm font-semibold text-zinc-700",
          "cursor-default select-none",
        )}>
        Proxy Tester
      </div>
      <div className="ml-auto flex gap-1 ">
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
        {/*<Tooltip>*/}
        {/*  <TooltipTrigger asChild>*/}
        {/*    <Button variant="ghost" size="icon" className="h-6 w-6 bg-opacity-80" onClick={handleHelp} >*/}
        {/*      <HelpCircle size={16} className="w-4 h-4"/>*/}
        {/*    </Button>*/}
        {/*  </TooltipTrigger>*/}
        {/*  <TooltipContent>*/}
        {/*    Help*/}
        {/*  </TooltipContent>*/}
        {/*</Tooltip>*/}
      </div>
    </div>
  )
}