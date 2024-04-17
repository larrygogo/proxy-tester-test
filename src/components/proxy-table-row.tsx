import { TableCell, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { ProxyStateInfo } from "@/types/proxy"
import { type Row, flexRender } from "@tanstack/react-table"
import type { Virtualizer } from "@tanstack/react-virtual"
import { writeText } from "@tauri-apps/api/clipboard"
import { useEffect, useState } from "react"

interface Props {
  row: Row<ProxyStateInfo>
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
      className={cn(
        "absolute flex w-full cursor-default select-none",
        "after:block after:absolute after:content-[''] after:w-full after:h-full after:z-[-1] after:bg-green-100 after:transition-background after:duration-300 after:ease-in-out",
        isCopied ? "after:w-full" : "after:w-0",
        virtualRow.index % 2 === 0 ? "bg-gray-100" : "bg-white",
      )}
      onClick={handleCopy}
      data-index={virtualRow.index} //needed for dynamic row height measurement
      ref={(node) => {
        rowVirtualizer.measureElement(node)
      }}
      style={{
        transform: `translateY(${String(virtualRow.start)}px)`, //this should always be a `style` as it changes on scroll
      }}
    >
      {row.getVisibleCells().map((cell) => {
        return (
          <TableCell
            className={cn("flex-1 truncate")}
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
