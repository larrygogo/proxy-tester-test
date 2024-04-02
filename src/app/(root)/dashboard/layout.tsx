"use client"
import {useContext, useEffect} from "react";
import {LayoutContext} from "@/context/LayoutContext";
import DarwinHeader from "@/components/layout/darwin-header";

type Props = {
  children: React.ReactNode;
}

export default function Layout(props: Props) {
  const {children} = props
  const {platform} = useContext(LayoutContext)

  const handleHelp = () => {
    import("@tauri-apps/api").then(({window}) => {
      new window.WebviewWindow("help", {
        title: 'Help',
        url: '/help',
      })
    })
  }

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

  useEffect(() => {
    if (platform === 'win32') {
      import("@tauri-apps/api").then(({window}) => {
        document.getElementById('titlebar-minimize')?.addEventListener('click', () => window.appWindow.minimize())
        document.getElementById('titlebar-maximize')?.addEventListener('click', () => window.appWindow.toggleMaximize())
        document.getElementById('titlebar-close')?.addEventListener('click', () => window.appWindow.close())
      })
    }
  }, [platform]);

  return (
    <div
      data-tauri-drag-region="true"
      className="h-screen flex flex-col bg-gradient-to-br from-[#d1e0f7] from-10% via-[#d7e0ff] via-50% to-[#d1e0f7] to-90%">
      {platform === "darwin" && (
        <div className=" px-2">
          <DarwinHeader/>
        </div>
      )}
      <div className="flex-1 overflow-auto px-2 pb-2">
        {children}
      </div>
    </div>
  )
}