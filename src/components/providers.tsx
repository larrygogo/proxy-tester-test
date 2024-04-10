"use client"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ProxyTaskProvider } from "@/context/ProxyTaskContext"
import type React from "react"

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers(props: ProvidersProps) {
  const { children } = props
  return (
    <TooltipProvider>
      <ProxyTaskProvider>{children}</ProxyTaskProvider>
    </TooltipProvider>
  )
}
