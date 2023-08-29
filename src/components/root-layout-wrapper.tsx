'use client'
import clsx from "clsx";
import {useEffect, useState} from "react";

const RootLayoutWrapper = (props: {children: React.ReactNode}) => {
  const {children} = props
  const [platform, setPlatform] = useState<string>()

  useEffect(() => {
    if (window && document) {
      import("@tauri-apps/api").then(({os}) => {
        return os.platform()
      }).then(p => {
        setPlatform(p)
        if (p === 'win32') {
          import("@tauri-apps/api/window").then(({appWindow}) => {
            document.getElementById('titlebar-minimize')?.addEventListener('click', () => appWindow.minimize())
            document.getElementById('titlebar-maximize')?.addEventListener('click', () => appWindow.toggleMaximize())
            document.getElementById('titlebar-close')?.addEventListener('click', () => appWindow.close())
          })
        }
      })
    }

  }, []);

  return (
    <div
      data-tauri-drag-region="true"
      className={clsx(
        "px-4 pt-4 h-screen bg-blue-950/80",
        platform === "win32" && "pt-8 bg-slate-600/100 rounded-lg",
        platform === "darwin" && "pt-8"
      )}>
      {platform === "win32" && (
        <div data-tauri-drag-region="true" className="absolute top-2 right-4 flex gap-4 titlebar text-white">
          <div className="titlebar-button" id="titlebar-minimize">
            <img
              src="https://api.iconify.design/mdi:window-minimize.svg"
              alt="minimize"
            />
          </div>
          <div className="titlebar-button" id="titlebar-maximize">
            <img
              src="https://api.iconify.design/mdi:window-maximize.svg"
              alt="maximize"
            />
          </div>
          <div className="titlebar-button" id="titlebar-close">
            <img src="https://api.iconify.design/mdi:close.svg" alt="close" />
          </div>
        </div>
      )}
      {children}
    </div>
  )
}

export default RootLayoutWrapper