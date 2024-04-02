"use client"
import {TooltipProvider} from "@/components/ui/tooltip";
import {ProxyTaskProvider} from "@/context/ProxyTaskContext";
import {LayoutProvider} from "@/context/LayoutContext";
import React from "react";

export default function Layout({
  children
}: {
  children: React.ReactNode
}) {
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }


  return (
    <LayoutProvider>
      <TooltipProvider>
        <ProxyTaskProvider>
          {children}
        </ProxyTaskProvider>
      </TooltipProvider>
    </LayoutProvider>
  )
}