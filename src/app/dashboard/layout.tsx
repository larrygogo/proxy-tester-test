'use client';
import {useEffect, useState} from "react";
import clsx from "clsx";
import Tooltip from "@/components/tooltip";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
}

export default function Layout(props: Props) {
  const {children} = props
  const [platform, setPlatform] = useState<string>()

  const handleHelp = () => {
    import("@tauri-apps/api/window").then(({WebviewWindow}) => {
      new WebviewWindow("help", {
        title: 'Help',
        url: '/help',
      })
    })
  }

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
        "h-screen bg-blue-950/80 font-mono pt-8",
        platform === "win32" && "bg-slate-600/100 rounded-lg",
      )}>
      {platform === "win32" && (
        <div data-tauri-drag-region="true" className="title-bar">
          <div className="title-bar-button minimize" id="titlebar-minimize">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 13H5v-2h14v2Z"/>
            </svg>
          </div>
          <div className="title-bar-button maximize" id="titlebar-maximize">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor"
                    d="M19 3H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m0 2v14H5V5h14Z"/>
            </svg>
          </div>
          <div className="title-bar-button close" id="titlebar-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor"
                    d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
            </svg>
          </div>
        </div>
      )}
      {
        platform === "darwin" && (
          <div data-tauri-drag-region="true" className="title-bar macos">
            <Tooltip label="Setting" placement="bottom">
              <Link href={'/dashboard/setting'}>
                <button
                  className="py-1 px-1 rounded text-slate-300 hover:text-gray-200 hover:bg-slate-100/20"
                  id="titlebar-close">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path fill="currentColor"
                          d="M12 8a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 2a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m-2 12c-.25 0-.46-.18-.5-.42l-.37-2.65c-.63-.25-1.17-.59-1.69-.99l-2.49 1.01c-.22.08-.49 0-.61-.22l-2-3.46a.493.493 0 0 1 .12-.64l2.11-1.66L4.5 12l.07-1l-2.11-1.63a.493.493 0 0 1-.12-.64l2-3.46c.12-.22.39-.31.61-.22l2.49 1c.52-.39 1.06-.73 1.69-.98l.37-2.65c.04-.24.25-.42.5-.42h4c.25 0 .46.18.5.42l.37 2.65c.63.25 1.17.59 1.69.98l2.49-1c.22-.09.49 0 .61.22l2 3.46c.13.22.07.49-.12.64L19.43 11l.07 1l-.07 1l2.11 1.63c.19.15.25.42.12.64l-2 3.46c-.12.22-.39.31-.61.22l-2.49-1c-.52.39-1.06.73-1.69.98l-.37 2.65c-.04.24-.25.42-.5.42h-4m1.25-18l-.37 2.61c-1.2.25-2.26.89-3.03 1.78L5.44 7.35l-.75 1.3L6.8 10.2a5.55 5.55 0 0 0 0 3.6l-2.12 1.56l.75 1.3l2.43-1.04c.77.88 1.82 1.52 3.01 1.76l.37 2.62h1.52l.37-2.61c1.19-.25 2.24-.89 3.01-1.77l2.43 1.04l.75-1.3l-2.12-1.55c.4-1.17.4-2.44 0-3.61l2.11-1.55l-.75-1.3l-2.41 1.04a5.42 5.42 0 0 0-3.03-1.77L12.75 4h-1.5Z"/>
                  </svg>
                </button>
              </Link>
            </Tooltip>
            <Tooltip label="Help" placement="bottom">
              <button onClick={handleHelp}
                      className="py-1 px-1 rounded text-slate-300 hover:text-gray-200 hover:bg-slate-100/20"
                      id="titlebar-close">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor"
                        d="M11 18h2v-2h-2v2m1-16A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-14a4 4 0 0 0-4 4h2a2 2 0 0 1 2-2a2 2 0 0 1 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5a4 4 0 0 0-4-4Z"/>
                </svg>
              </button>
            </Tooltip>
          </div>
        )}
      <div className="h-full px-4 text-gray-400">
        <div className="flex flex-col h-full bg-white rounded-t-lg overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}