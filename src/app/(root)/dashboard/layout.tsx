"use client"
import React, {useContext, useEffect} from "react";
import {LayoutContext} from "@/context/LayoutContext";
import DarwinHeader from "@/components/layout/darwin-header";
import WinHeader from "@/components/layout/win-header";
import {Toaster} from "@/components/ui/sonner";

type Props = {
  children: React.ReactNode;
}

export default function Layout(props: Props) {
  const {children} = props
  const {platform} = useContext(LayoutContext)

  useEffect(() => {
    import('@tauri-apps/api').then(({window}) => {
      const all = window.getAll()
      const splashscreen = all.find(w => w.label === 'splashscreen')
      const main = all.find(w => w.label === 'main')
      if (main) {
        main.show().then()
      }
      if (splashscreen) {
        splashscreen.close().then()
      }
    })
  }, []);

  return (
    <div
      data-tauri-drag-region="true"
      className="flex h-screen flex-col bg-gradient-to-br from-[#d1e0f7] from-10% via-[#d7e0ff] via-50% to-[#d1e0f7] to-90%">
      {platform === "darwin" && (
        <div className=" px-2">
          <DarwinHeader/>
        </div>
      )}
      {platform === "win32" && (
          <div className="w-full">
            <WinHeader />
          </div>
      )}
      <div className="flex-1 overflow-auto px-2 pb-2">
        {children}
        <Toaster expand={true} visibleToasts={1} offset={40} richColors />
      </div>
    </div>
  )
}