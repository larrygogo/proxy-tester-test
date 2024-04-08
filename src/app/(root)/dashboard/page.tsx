"use client"
import {useContext, useEffect, useRef, useState} from "react";
import {ChevronDown, HelpCircle, Loader, Plus, Rocket, Settings} from "lucide-react";

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ColumnDef, flexRender, getCoreRowModel, Row, useReactTable} from "@tanstack/react-table";
import {ProxyProtocol, PROXY_PROTOCOL_ENUM, ProxyTaskContext, TASK_STATUS_ENUM} from "@/context/ProxyTaskContext";
import ProxyEditDialog from "@/components/proxy-edit-dialog";
import {cn} from "@/lib/utils";
import {ProxyDisplayInfo} from "@/types/proxy";
import {useVirtualizer} from "@tanstack/react-virtual";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import InterparkQueueTaskDialog from "@/app/(root)/dashboard/components/interpark-queue-task-dialog";
import Footer from "@/app/(root)/dashboard/components/footer/footer";
import {Input} from "@/components/ui/input";


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

const protocolOptions = Object.entries(PROXY_PROTOCOL_ENUM).map(([value, label]) => ({
  label,
  value
}))

export default function Page() {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [shouldStartTask, setShouldStartTask] = useState(false)
  const [interparkQueueDialogOpen, setInterparkQueueDialogOpen] = useState(false)
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
    setTarget,
    startTaskWithMode,
    taskMode
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
    overscan: 100,
  })

  const handleClick = async () => {
    if (!target) {
      setTarget?.('www.google.com')
    }

    if (taskStatus === TASK_STATUS_ENUM.RUNNING) {
      stopTask?.()
    } else {
      setShouldStartTask(true)
    }
  }

  const handleTestInterpark = async () => {
    if (taskStatus === TASK_STATUS_ENUM.RUNNING) {
      stopTask?.()
    } else {
      startTaskWithMode?.('test_interpark_global_index')
    }
  }

  const handleTestMelon = async () => {
    if (taskStatus === TASK_STATUS_ENUM.RUNNING) {
      stopTask?.()
    } else {
      startTaskWithMode?.('test_melon_global_index')
    }
  }

  useEffect(() => {
    if (target && taskStatus !== TASK_STATUS_ENUM.RUNNING && shouldStartTask) {
      startTask?.();
      setShouldStartTask(false);
    }
  }, [target, shouldStartTask, startTask, taskStatus]);

  return (
    <Card className="flex h-full flex-col overflow-hidden text-xs shadow-sm">
      <CardHeader className="h-16 bg-gray-50 p-4">
        <div className="flex gap-2">
          <Select value={protocol} onValueChange={(v) => setProtocol?.(v as ProxyProtocol)}>
            <SelectTrigger className="w-52 select-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {protocolOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            disabled={taskStatus === TASK_STATUS_ENUM.RUNNING}
            value={
              taskMode !== 'normal' && taskStatus === TASK_STATUS_ENUM.RUNNING ?
                `专业模式：${taskMode}` :
                target
            }
            className="w-full bg-transparent px-3 py-1 outline-none focus-visible:ring-0 disabled:bg-gray-200 disabled:opacity-100"
            placeholder="www.google.com"
            onChange={e => setTarget?.(e.target.value ?? "")}
          />
          <div className="flex divide-x divide-gray-700">
            <Button
              color="primary"
              className="select-none items-center gap-1 rounded-r-none"
              onClick={handleClick}>
              {taskStatus === TASK_STATUS_ENUM.RUNNING ?
                <Loader className="h-4 w-4 animate-spin"/> :
                <Rocket className="h-4 w-4"/>
              }
              {taskStatus === TASK_STATUS_ENUM.RUNNING ?
                <span>停止</span> :
                <span>测试</span>
              }
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={taskStatus === TASK_STATUS_ENUM.RUNNING}
                  className="rounded-l-none px-1 outline-none focus-visible:ring-0 disabled:bg-zinc-600 disabled:opacity-100">
                  <ChevronDown size={16}/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="flex items-center gap-1">
                  <span>专业模式</span>
                  <Tooltip>
                    <TooltipTrigger><HelpCircle size={16}/></TooltipTrigger>
                    <TooltipContent side="bottom">对专门网站的特殊场景进行测试</TooltipContent>
                  </Tooltip>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={handleTestInterpark}>Interpark</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setInterparkQueueDialogOpen(true)
                  }}
                >
                  Interpark 排队
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTestMelon}>Melon</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Separator orientation="vertical"/>
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditDialogOpen(true)}>
                  <Plus size={16} className="h-4 w-4"/>
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
                    <Settings size={16} className="h-4 w-4"/>
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
      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="flex h-full flex-col">
          <div className="relative h-full w-full flex-1 flex-col overflow-auto" ref={tableContainerRef}>
            <table className="grid w-full caption-bottom text-sm">
              <TableHeader className="sticky top-0 z-10 grid bg-gray-50/50 backdrop-blur ">
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
                className="relative grid font-mono"
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
                }}>
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const row = rows[virtualRow.index] as Row<ProxyDisplayInfo>
                    return (
                      <TableRow
                        className="absolute flex w-full"
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
                              className="flex-1 truncate"
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
          <Footer/>
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
      <InterparkQueueTaskDialog open={interparkQueueDialogOpen} onOpenChange={setInterparkQueueDialogOpen}/>
    </Card>
  )
}