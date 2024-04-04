'use client'
import Link from "next/link";
import {useContext} from "react";
import {ProxyTaskContext} from "@/context/ProxyTaskContext";
import {Button} from "@/components/ui/button";
import {Info, X} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Slider} from "@/components/ui/slider";

export default function Page() {
  const {concurrency, setConcurrency} = useContext(ProxyTaskContext)

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="flex flex-row justify-between space-y-0 bg-gray-50 p-4">
        <CardTitle className="text-2xl">
          设置
        </CardTitle>
        <Button asChild size="icon" variant="ghost">
          <Link href={'/dashboard'}>
            <X className="h-4 w-4"/>
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-gray-800">
            <span>并发数</span>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} className="h-4 w-4"/>
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
              max={50}/>
            <div className="w-12 text-center text-sm">
              {concurrency}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}