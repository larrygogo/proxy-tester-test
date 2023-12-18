'use client';
import {useContext} from "react";
import clsx from "clsx";
import {LayoutContext} from "@/context/LayoutContext";
import {ProxyTaskContext} from "@/context/ProxyTaskContext";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ChevronDown, Rocket} from "lucide-react";

const protocols = [{
  name: 'HTTP(S)',
  value: 'http'
}, {
  name: 'SOCKS5',
  value: 'socks5'
}]

type Props = {
  onEdit?: () => void
}

export default function TargetInput(props: Props) {
  const {onEdit} = props
  const {platform} = useContext(LayoutContext)
  const {
    protocol,
    setProtocol,
    target,
    setTarget,
    startTask
  } = useContext(ProxyTaskContext)

  const handleStart = async () => {
    startTask?.()
  }

  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="justify-between w-36" variant="outline">
            {protocol}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value={protocol} onValueChange={setProtocol}>
          {protocols.map((item, index) => (
            <DropdownMenuRadioItem
              value={item.value}
              key={index}
              onClick={() => setProtocol?.(item.value as any)}
            >
              {item.name}
            </DropdownMenuRadioItem>
          ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Input
        className="font-mono"
        value={target}
        placeholder="Target URL/IP"
        onChange={(e) => setTarget?.(e.target.value)}/>
      <div className="flex gap-1 items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={!target}
              onClick={handleStart}>
              <Rocket className="w-4 h-4 mr-2" />
              <span>Test</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Test Proxy
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}