'use client'
import Link from "next/link";
import {useContext} from "react";
import {ProxyTaskContext} from "@/context/ProxyTaskContext";
import {Button} from "@/components/ui/button";
import {Info, X} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export default function Page() {
  const {concurrency, setConcurrency} = useContext(ProxyTaskContext)

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="p-4 flex flex-row space-y-0 justify-between bg-gray-50">
          <CardTitle className="text-2xl">
            设置
          </CardTitle>
        <Button asChild size="icon" variant="ghost">
          <Link href={'/dashboard'}>
            <X className="w-4 h-4"/>
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div>
          <h4 className="text-gray-800 text-sm font-bold">
            <span>并发数</span>
            <span className="inline text-gray-400 pl-2">
              <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info size={16} className="w-4 h-4"/>
                </TooltipTrigger>
                <TooltipContent>
                  设置并发数
                </TooltipContent>
              </Tooltip>
              </TooltipProvider>
            </span>
          </h4>
          <div className="flex items-center gap-2">
            <input
              type="range" min="1" max="100" step="1"
              className="w-52 appearance-none bg-transparent [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-black/10 [&::-webkit-slider-runnable-track]:h-[6px] [&::-webkit-slider-thumb]:-mt-[4px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[14px] [&::-webkit-slider-thumb]:w-[8px] [&::-webkit-slider-thumb]:rounded [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:bg-blue-600/80"
              value={concurrency} onChange={(e) => setConcurrency?.(Number(e.target.value))}/>{/*  slider*/}
            <div className="w-12 text-center text-sm">
              {concurrency}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}