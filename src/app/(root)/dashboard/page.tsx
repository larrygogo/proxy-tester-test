"use client"
import {useContext, useState} from "react";
import {Loader, Plus, Rocket, Settings} from "lucide-react";

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ColumnDef, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {ScrollArea} from "@/components/ui/scroll-area";
import {ProxyProtocol, ProxyProtocolEnum, ProxyTaskContext, TaskStatus} from "@/context/ProxyTaskContext";
import ProxyEditDialog from "@/components/proxy-edit-dialog";
import {cn} from "@/lib/utils";

const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'host',
    header: '服务器地址',
  },
  {
    accessorKey: 'port',
    header: '端口',
  },
  {
    accessorKey: 'username',
    header: '用户名',
  },
  {
    accessorKey: 'password',
    header: '密码',
  },
  {
    accessorKey: 'status',
    header: '状态',
    cell: ({getValue}) => {
      const value = getValue?.()
      if(!value) return <span>-</span>
      const isOk = (value as string).toUpperCase() === 'OK'
      return <span className={cn(
        "uppercase",
        isOk ? 'text-green-500' : 'text-red-500'
      )}>{isOk ? '正常' : `${value}`}</span>
    }
  },
  {
    accessorKey: 'speed',
    header: '延迟',
    cell: ({getValue}) => {
      const value = getValue?.()
      return <span>{value ? `${value} ms` : '-'}</span>
    }
  }
]

const protocolOptions = Object.entries(ProxyProtocolEnum).map(([value, label]) => ({
  label,
  value
}))

export default function Page() {
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const {
    taskStatus,
    startTask,
    proxyStates,
    stopTask,
    proxyList,
    setProxyList,
    protocol,
    setProtocol,
    target,
    setTarget
  } = useContext(ProxyTaskContext)

  const table = useReactTable({
    data: proxyStates ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleClick = async () => {
    if (taskStatus === TaskStatus.RUNNING) {
      stopTask?.()
    } else {
      startTask?.()
    }
  }

  return (
    <Card className="flex flex-col shadow-sm overflow-hidden h-full">
      <CardHeader className="p-4 bg-gray-50 h-16">
        <div className="flex gap-2">
          <Select value={protocol} onValueChange={(v) => {
            console.log(v)
            setProtocol?.(v as ProxyProtocol)
          }}>
            <SelectTrigger className="w-52">
              <SelectValue/>
            </SelectTrigger>
            <SelectContent>
              {protocolOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div
            className="flex items-center w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
            <span className="text-muted-foreground mr-1 pointer-events-none">
              http://
            </span>
            <input value={target} className="w-full outline-none bg-transparent" placeholder="www.google.com"
                   onChange={e => setTarget?.(e.target.value ?? "")}/>
          </div>
          <Button
            color="primary"
            className="items-center gap-1"
            onClick={handleClick}>
            {taskStatus === TaskStatus.RUNNING ?
              <Loader className="w-4 h-4 animate-spin"/> :
              <Rocket className="w-4 h-4"/>
            }
            {taskStatus === TaskStatus.RUNNING ?
              <span>停止</span> :
              <span>测试</span>
            }

          </Button>
          <Separator orientation="vertical"/>
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditDialogOpen(true)}>
                  <Plus size={16} className="w-4 h-4"/>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                添加代理
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  size="icon"
                  variant="ghost">
                  <Link href={`/dashboard/setting`}>
                    <Settings size={16} className="w-4 h-4"/>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                设置
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <ScrollArea className="flex-1 w-full h-full">
            <table className="w-full caption-bottom text-sm">
              <TableHeader className="sticky top-0 rounded bg-gray-50/50 backdrop-blur">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="truncate">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </table>
          </ScrollArea>
          <div className="flex bg-gray-50 text-xs p-2">
            <div className="flex justify-between w-full">
              <div className="flex gap-2 items-center">
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-1">
                    <div className={cn(
                      "w-2 h-2 rounded-full bg-green-500",
                      TaskStatus.RUNNING === taskStatus ? 'bg-green-500' : 'bg-gray-300'
                    )}/>
                    <span>{TaskStatus.RUNNING === taskStatus ? '运行中' : '空闲'}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    当前状态
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-1">
                    <span>{proxyStates?.filter((item) => item.status).length}</span>
                    <span>/</span>
                    <span>{proxyStates?.length}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    当前状态
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex">
                <button
                  className="py-0.5 px-2 hover:bg-gray-200 rounded-md"
                  onClick={async () => {
                    const data = proxyStates?.filter((item) => item.status?.toUpperCase() === 'OK').map((item) => `${item.host}:${item.port}${item.username ? `:${item.username}:${item.password}` : ''}`).join('\n')
                    // 选则文件保存路径
                    const dialog = await import("@tauri-apps/api/dialog")
                    const result = await dialog.save({defaultPath: 'proxy.txt', filters: [{name: 'Text', extensions: ['txt']}]})
                    if (result) {
                      const fs = await import("@tauri-apps/api/fs")
                      await fs.writeFile({
                        path: result,
                        contents: data ?? ''
                      })
                      console.log('File written successfully')
                    }
                  }}>
                  导出可用
                </button>
              </div>
            </div>
          </div>

        </div>

      </CardContent>
      <ProxyEditDialog
        value={proxyList?.join('\n')}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onFinish={(v) => {
          setProxyList?.(v.split("\n").filter(Boolean))
          return true
        }}
      />
    </Card>
  )
}