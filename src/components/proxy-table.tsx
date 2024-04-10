import ProxyTableRow from "@/components/proxy-table-row"
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { ProxyDisplayInfo } from "@/types/proxy"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useRef } from "react"

const columns: ColumnDef<ProxyDisplayInfo>[] = [
  {
    id: "host",
    accessorKey: "host",
    header: "服务器地址",
    maxSize: 200,
  },
  {
    id: "port",
    accessorKey: "port",
    header: "端口",
    size: 30,
    maxSize: 80,
  },
  {
    accessorKey: "username",
    header: "用户名",
    minSize: 200,
  },
  {
    accessorKey: "password",
    header: "密码",
    minSize: 0,
  },
  {
    accessorKey: "status",
    header: "状态",
    size: 60,
    maxSize: 100,
    cell: ({ getValue }) => {
      const value = getValue() as string | undefined
      if (!value) return <span>-</span>
      const isOk = value.toUpperCase() === "OK"
      return (
        <span
          className={cn("uppercase", isOk ? "text-green-500" : "text-red-500")}
        >
          {isOk ? "正常" : String(value)}
        </span>
      )
    },
  },
  {
    accessorKey: "speed",
    header: () => <div className="text-right">延迟</div>,
    size: 100,
    maxSize: 100,
    cell: ({ getValue }) => {
      const value = getValue() as number | undefined
      return (
        <div className="text-right">{value ? `${String(value)} ms` : "-"}</div>
      )
    },
  },
]

interface Props {
  proxyStates: ProxyDisplayInfo[]
}

export default function ProxyTable(props: Props) {
  const { proxyStates } = props

  const table = useReactTable({
    data: proxyStates,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  const { rows } = table.getRowModel()
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 50, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" && !navigator.userAgent.includes("Firefox")
        ? (element) => element.getBoundingClientRect().height
        : undefined,
    overscan: 10,
  })

  return (
    <div
      className="relative size-full flex-1 flex-col overflow-auto"
      ref={tableContainerRef}
    >
      <table className="relative w-full flex flex-col caption-bottom text-sm overflow-clip">
        <TableHeader className="sticky top-0 w-full z-10 grid bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="flex w-full" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className="flex flex-1 items-center"
                    key={header.id}
                    style={{
                      width: header.column.columnDef.size,
                      maxWidth: header.column.columnDef.maxSize,
                      minWidth: header.column.columnDef.minSize,
                    }}
                    onClick={() => {
                      header.column.getToggleSortingHandler()
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
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
            height: `${String(rowVirtualizer.getTotalSize())}px`, //tells scrollbar how big the table is
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index]
            return (
              <ProxyTableRow
                row={row}
                virtualRow={virtualRow}
                rowVirtualizer={rowVirtualizer}
                key={row.id}
              />
            )
          })}
        </TableBody>
      </table>
    </div>
  )
}
