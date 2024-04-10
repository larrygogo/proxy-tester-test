import DarwinHeader from "@/components/layout/darwin-header"
import WinHeader from "@/components/layout/win-header"
import { type Platform, platform as getPlatform } from "@tauri-apps/api/os"
import React, { useEffect, useState } from "react"

export default function GlobalHeader() {
  const [platform, setPlatform] = useState<Platform>()

  useEffect(() => {
    void (async () => {
      setPlatform(await getPlatform())
    })()
  }, [])

  return (
    <header data-tauri-drag-region="true" className="">
      {platform === "darwin" && (
        <div className=" px-2">
          <DarwinHeader />
        </div>
      )}
      {platform === "win32" && (
        <div className="w-full">
          <WinHeader />
        </div>
      )}
    </header>
  )
}
