"use client"
import {useContext, useEffect, useRef, useState} from "react";
import {Loader, Plus, Rocket, Settings} from "lucide-react";

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ColumnDef, flexRender, getCoreRowModel, Row, useReactTable} from "@tanstack/react-table";
import {ProxyProtocol, ProxyProtocolEnum, ProxyTaskContext, TaskStatus} from "@/context/ProxyTaskContext";
import ProxyEditDialog from "@/components/proxy-edit-dialog";
import {cn} from "@/lib/utils";
import {ProxyDisplayInfo} from "@/types/proxy";
import {useVirtualizer} from "@tanstack/react-virtual";


const columns: ColumnDef<ProxyDisplayInfo>[] = [
  {
    id: 'host',
    accessorKey: 'host',
    header: '服务器地址',
    maxSize: 200,
  },
  {
    id: 'port',
    accessorKey: 'port',
    header: '端口',
    size: 50,
    maxSize: 100,
  },
  {
    accessorKey: 'username',
    header: '用户名',
    minSize: 200
  },
  {
    accessorKey: 'password',
    header: '密码',
    minSize: 0
  },
  {
    accessorKey: 'status',
    header: '状态',
    size: 60,
    maxSize: 100,
    cell: ({getValue}) => {
      const value = getValue?.() as string | undefined
      if (!value) return <span>-</span>
      const isOk = value.toUpperCase() === 'OK'
      return <span className={cn(
        "uppercase",
        isOk ? 'text-green-500' : 'text-red-500'
      )}>{isOk ? '正常' : `${value}`}</span>
    }
  },
  {
    accessorKey: 'speed',
    header: () => <div className="text-right">延迟</div>,
    size: 100,
    maxSize: 100,
    cell: ({getValue}) => {
      const value = getValue?.() as number | undefined
      return <div className="text-right">{value ? `${value} ms` : '-'}</div>
    }
  }
]

const protocolOptions = Object.entries(ProxyProtocolEnum).map(([value, label]) => ({
  label,
  value
}))

export default function Page() {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [shouldStartTask, setShouldStartTask] = useState(false)
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
  const {rows} = table.getRowModel()
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 50, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? element => element?.getBoundingClientRect().height
        : undefined,
    overscan: 20,
  })

  const handleClick = async () => {
    if (!target) {
      setTarget?.('www.google.com')
    }

    if (taskStatus === TaskStatus.RUNNING) {
      stopTask?.()
    } else {
      setShouldStartTask(true)
    }
  }

  useEffect(() => {
    if (target && taskStatus !== TaskStatus.RUNNING && shouldStartTask) {
      startTask?.();
      setShouldStartTask(false);
    }
  }, [target, shouldStartTask, startTask, taskStatus]);

  return (
    <Card className="flex flex-col shadow-sm overflow-hidden h-full">
      <CardHeader className="p-4 bg-gray-50 h-16">
        <div className="flex gap-2">
          <Select value={protocol} onValueChange={(v) => setProtocol?.(v as ProxyProtocol)}>
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
            className="font-mono flex items-center w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
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
          <div className="flex-1 flex-col w-full h-full relative overflow-auto" ref={tableContainerRef}>
            <table className="grid w-full caption-bottom text-sm">
              <TableHeader className="grid sticky top-0 z-10 bg-gray-50/50 backdrop-blur ">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    className="flex w-full"
                    key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          className="flex flex-1 items-center"
                          key={header.id}
                          style={{
                            width: header.column.columnDef.size,
                            maxWidth: header.column.columnDef.maxSize,
                            minWidth: header.column.columnDef.minSize
                          }}
                          onClick={() => {
                            header.column.getToggleSortingHandler()
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody
                className="font-mono relative grid"
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
                }}>
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const row = rows[virtualRow.index] as Row<ProxyDisplayInfo>
                    return (
                      <TableRow
                        className="flex absolute w-full"
                        data-index={virtualRow.index} //needed for dynamic row height measurement
                        ref={node => rowVirtualizer.measureElement(node)} //measure dynamic row height
                        key={row.id}
                        style={{
                          transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                        }}
                      >
                        {row.getVisibleCells().map(cell => {
                          return (
                            <TableCell
                              className="truncate flex-1"
                              key={cell.id}
                              style={{
                                width: cell.column.columnDef.size,
                                maxWidth: cell.column.columnDef.maxSize,
                                minWidth: cell.column.columnDef.minSize
                              }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    )
                  }
                )}
              </TableBody>
            </table>
          </div>
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
                    进度
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
                    const result = await dialog.save({
                      defaultPath: 'proxy.txt',
                      filters: [{name: 'Text', extensions: ['txt']}]
                    })
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