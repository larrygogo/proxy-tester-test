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
      })
    }
  }, []);

  useEffect(() => {
    if (platform === 'win32') {
      import("@tauri-apps/api/window").then(({appWindow}) => {
        document.getElementById('titlebar-minimize')?.addEventListener('click', () => appWindow.minimize())
        document.getElementById('titlebar-maximize')?.addEventListener('click', () => appWindow.toggleMaximize())
        document.getElementById('titlebar-close')?.addEventListener('click', () => appWindow.close())
      })
    }
  }, [platform]);

  return (
    <div
      data-tauri-drag-region="true"
      className={clsx(
        "px-4 pt-4 h-screen bg-blue-950/80",
        platform === "win32" && "pt-8 bg-slate-600/100 rounded-lg",
        platform === "darwin" && "pt-8"
      )}>
      {platform === "win32" && (
        <div data-tauri-drag-region="true" className="title-bar">
          <div className="title-bar-button minimize" id="titlebar-minimize">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M19 13H5v-2h14v2Z"/></svg>
          </div>
          <div className="title-bar-button maximize" id="titlebar-maximize">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m0 2v14H5V5h14Z"/></svg>
          </div>
          <div className="title-bar-button close" id="titlebar-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/></svg>
          </div>
        </div>
      )}
      {children}
    </div>
  )
}

export default RootLayoutWrapper