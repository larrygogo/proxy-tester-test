import {TableCell, TableRow} from "@/components/ui/table";
import {flexRender, Row} from "@tanstack/react-table";
import {ProxyDisplayInfo} from "@/types/proxy";
import {useEffect, useState} from "react";
import {cn} from "@/lib/utils";

interface Props {
  row: Row<ProxyDisplayInfo>
  virtualRow: { index: number, start: number }
  rowVirtualizer: any
}

export default function ProxyTableRow(props: Props) {
  const {row, virtualRow, rowVirtualizer} = props

  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    const {host, port, username, password} = row.original
    const proxy = `${host}:${port}${username ? `:${username}:${password}` : ''}`
    const {writeText} = await import("@tauri-apps/api/clipboard")
    await writeText(proxy)
    setIsCopied(true)
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
  }, [isCopied]);

  return (
    <TableRow
      key={row.id}
      className={cn(
        "absolute flex w-full cursor-default select-none",
      )}
      onClick={handleCopy}
      data-index={virtualRow.index} //needed for dynamic row height measurement
      ref={node => rowVirtualizer.measureElement(node)} //measure dynamic row height
      style={{
        transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
      }}
    >
      <div className={cn(
        "absolute -z-10 h-full w-0 bg-green-200 transition-all duration-200",
        isCopied && 'w-full',
      )} />
      {row.getVisibleCells().map(cell => {
        return (
          <TableCell
            className="flex-1 truncate bg-transparent"
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