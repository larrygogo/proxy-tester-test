"use client"
export default function HelpPage() {
  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-4 text-2xl">快捷方式</div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="text-lg font-bold">编辑 Proxy</div>
              <div className="text-sm text-gray-400">
                Cmd/Ctrl + E
              </div>
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold">保存 Proxy</div>
              <div className="text-sm text-gray-400">
                Cmd/Ctrl + S
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4 mt-8 text-2xl">常见问题</div>
    </div>
  )
}