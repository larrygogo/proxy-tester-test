'use client'
import {useContext, useEffect, useMemo, useState} from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import {LayoutContext} from "@/context/LayoutContext";
import {ProxyTaskContext} from "@/context/ProxyTaskContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {ChevronDown, Edit, Rocket} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {ProxyType} from "@/types/proxy";
import ProxyEditDialog from "@/app/dashboard/components/proxy-edit-dialog";
import {columns, ProxyDetail} from "@/app/dashboard/columns";
import {DataTable} from "@/app/dashboard/data-table";

const proxyTypes: ProxyType[] = [
  {name: 'HTTP(S)', value: 'http'},
  {name: 'SOCKS5', value: 'socks5'},
]

 function getProxies() : ProxyDetail[] {
  return [{
    host: '127.0.0.1',
    port: 1080,
    username: 'user',
    password: 'password',
    status: 'OK',
    speed: 100
  }, {
    host: '127.0.0.1',
    port: 1080,
    username: 'user',
    password: 'password',
    status: 'OK',
    speed: 200
  }, {
    host: '127.0.0.1',
    port: 1080,
    username: 'user',
    password: 'password',
    status: 'OK',
    speed: 200
  }, {
    host: '127.0.0.1',
    port: 1080,
    username: 'user',
    password: 'password',
    status: 'OK',
    speed: 200
  }, {
    host: '127.0.0.1',
    port: 1080,
    username: 'user',
    password: 'password',
    status: 'OK',
    speed: 200
  }, {
    host: '127.0.0.1',
    port: 1080,
    username: 'user',
    password: 'password',
    status: 'OK',
    speed: 200
  }, {
    host: '127.0.0.1',
    port: 1080,
    username: 'user',
    password: 'password',
    status: 'OK',
    speed: 200
  }, {
    host: '127.0.0.1',
    port: 1080,
    username: 'user',
    password: 'password',
    status: 'OK',
    speed: 200
  }, {
    host: '127.0.0.1',
    port: 1080,
    username: 'user',
    password: 'password',
    status: 'OK',
    speed: 200
  }, {
    host: '127.0.0.1',
    port: 1080,
    username: 'user',
    password: 'password',
    status: 'OK',
    speed: 200
  }, {
    host: '127.0.0.1',
    port: 1080,
    username: 'user',
    password: 'password',
    status: 'OK',
    speed: 200
  }, {
    host: '127.0.0.1',
    port: 1080,
    username: 'user',
    password: 'password',
    status: 'OK',
    speed: 200
  }, {
    host: '127.0.0.1',
    port: 1080,
    username: 'user',
    password: 'password',
    status: 'OK',
    speed: 200
  }, {
    host: '127.0.0.1',
    port: 1080,
    username: 'user',
    password: 'password',
    status: 'OK',
    speed: 200
  }, {
    host: '127.0.0.1',
    port: 1080,
    username: 'user',
    password: 'password',
    status: 'OK',
    speed: 200
  }, {
    host: '127.0.0.1',
    port: 1080,
    username: 'user',
    password: 'password',
    status: 'OK',
    speed: 200
  }, {
    host: '127.0.0.1',
    port: 1080,
    username: 'user',
    password: 'password',
    status: 'OK',
    speed: 200
  }, {
    host: '127.0.0.1',
    port: 1080,
    username: 'user',
    password: 'password',
    status: 'OK',
    speed: 200
  }, {
    host: '127.0.0.1',
    port: 1080,
    username: 'user',
    password: 'password',
    status: 'OK',
    speed: 200
  }, {
    host: '127.0.0.1',
    port: 1080,
    username: 'user',
    password: 'password',
    status: 'OK',
    speed: 200
  }]
}

export default function Page() {
  const data =  getProxies()
  const [protocol, setProtocol] = useState<string>('http')
  const [target, setTarget] = useState('')
  const [copied, setCopied] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const {platform} = useContext(LayoutContext)

  const currentProxyType = useMemo(() => proxyTypes.find(p => p.value === protocol) || proxyTypes[0], [protocol])

  const {proxyList, proxyStates, taskStatus, finishedCount} = useContext(ProxyTaskContext)

  const handleCopy = async () => {
    const text = proxyStates?.filter(p => p.status === 'OK').map(p => p.value).join('\n')
    await window.navigator.clipboard.writeText(text || '')
    setCopied(true)
  }

  const handleStart = async () => {

  }


  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 3000)
    }
  }, [copied]);


  return (
    <div
      data-tauri-drag-region="true"
      className="h-full flex flex-col gap-2">
      <div className="p-4 flex gap-2 bg-zinc-50 rounded-lg">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="justify-between w-36" variant="outline">
              {currentProxyType.name}
              <ChevronDown className="w-4 h-4"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-28">
            <DropdownMenuRadioGroup value={protocol} onValueChange={setProtocol}>
              {proxyTypes.map((item, index) => (
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
          className="font-mono focus-visible:ring-0"
          value={target}
          placeholder="目标网站"
          onChange={(e) => setTarget?.(e.target.value)}/>
        <div className="flex gap-1 items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                disabled={!target}
                onClick={handleStart}>
                <Rocket className="w-4 h-4 mr-2"/>
                <span>测试</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Test Proxy
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="grow overflow-auto flex flex-col bg-zinc-50 rounded-lg">
        <div className="p-2 px-4 border-b">
          <div className="flex justify-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-xs"
                  className="hover:bg-zinc-200/50"
                  variant="ghost"
                  onClick={() => setEditDialogOpen(true)}
                >
                  <Edit className="w-4 h-4 "/>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                编辑
              </TooltipContent>
            </Tooltip>
            <ProxyEditDialog open={editDialogOpen} onOpenChange={setEditDialogOpen}/>
          </div>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}