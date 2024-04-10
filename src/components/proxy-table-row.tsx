import { TableCell, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { ProxyDisplayInfo } from "@/types/proxy"
import { type Row, flexRender } from "@tanstack/react-table"
import type { Virtualizer } from "@tanstack/react-virtual"
import { writeText } from "@tauri-apps/api/clipboard"
import { useEffect, useState } from "react"

interface Props {
  row: Row<ProxyDisplayInfo>
  virtualRow: { index: number; start: number }
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>
}

export default function ProxyTableRow(props: Props) {
  const { row, virtualRow, rowVirtualizer } = props

  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    const { host, port, username, password } = row.original
    const proxy = `${host}:${String(port)}${
      username && password ? `:${username}:${password}` : ""
    }`
    void writeText(proxy).then(() => {
      setIsCopied(true)
    })
  }

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false)
      }, 1000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [isCopied])

  return (
    <TableRow
      key={row.id}
      className={cn("absolute flex w-full cursor-default select-none")}
      onClick={handleCopy}
      data-index={virtualRow.index} //needed for dynamic row height measurement
      ref={(node) => {
        rowVirtualizer.measureElement(node)
      }} //measure dynamic row height
      style={{
        transform: `translateY(${String(virtualRow.start)}px)`, //this should always be a `style` as it changes on scroll
      }}
    >
      <div
        className={cn(
          "absolute -z-10 h-full w-0 bg-green-200 transition-all duration-200",
          isCopied && "w-full",
        )}
      />
      {row.getVisibleCells().map((cell) => {
        return (
          <TableCell
            className="flex-1 truncate bg-transparent"
            key={cell.id}
            style={{
              width: cell.column.columnDef.size,
              maxWidth: cell.column.columnDef.maxSize,
              minWidth: cell.column.columnDef.minSize,
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        )
      })}
    </TableRow>
  )
}
