'use client'
import TargetInput from "@/components/target-input";
import {useContext, useEffect, useState} from "react";
import clsx from "clsx";
import ProxyListEditDialog from "@/components/proxy-list-edit-dialog";
import ScrollBar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import {isRegistered, register, unregister} from "@tauri-apps/api/globalShortcut";
import ProxyStatusList from "@/components/proxy-status-list";
import Image from "next/image";
import {LayoutContext} from "@/context/LayoutContext";
import {ProxyTaskContext, TaskStatus} from "@/context/ProxyTaskContext";

export default function Page() {
  const [copied, setCopied] = useState(false)
  const [showShadow, setShowShadow] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [scrollBarRef, setScrollBarRef] = useState<HTMLElement | null>(null)
  const {platform} = useContext(LayoutContext)
  const {proxyList, proxyStates, taskStatus, finishedCount} = useContext(ProxyTaskContext)

  const scrollMenu = (container: any) => {
    if (container) {
      if (container.scrollTop > 0) {
        setShowShadow(true)
      } else {
        setShowShadow(false)
      }
    }
  }

  const handleCopy = async () => {
    const text = proxyStates?.filter(p => p.status === 'OK').map(p => p.value).join('\n')
    await navigator.clipboard.writeText(text || '')
    setCopied(true)
  }

  useEffect(() => {
    (async () => {
      // 注册快捷键
      const registered = await isRegistered('CmdOrCtrl+E')
      if (!registered) {
        await register('CmdOrCtrl+E', () => setEditDialogOpen(v => !v))
      }
    })()

    return () => {
      // 销毁快捷键
      unregister('CmdOrCtrl+E').then()
    }
  }, []);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 3000)
    }
  }, [copied]);

  useEffect(() => {
    if (scrollBarRef) {
      scrollBarRef.scrollTop = 0
    }
    setShowShadow(false)
  }, [proxyList, scrollBarRef]);

  return (
    <div className="flex flex-col h-full">
      <div className={clsx(
        "py-4 px-4 bg-white z-10",
        showShadow && "shadow border-b border-gray-200 z-10"
      )}>
        <TargetInput onEdit={() => setEditDialogOpen(true)}/>
      </div>
      <div className="flex-1 overflow-hidden">
        {proxyStates?.length! > 0 ? (
          <ScrollBar containerRef={ref => setScrollBarRef(ref)} onScrollY={scrollMenu}>
            <ProxyStatusList data={proxyStates || []}/>
          </ScrollBar>
        ) : (
          <div className="flex-1 flex items-center justify-center w-full h-full">
            <div className="flex flex-col gap-4 items-center">
              <Image className="select-none" src="/images/empty-list.svg" width={200} height={200} alt="empty-list"/>
              <button
                onClick={() => setEditDialogOpen(true)}
                className="flex gap-2 items-center py-1 px-4 rounded-md text-blue-500 border-2 border-blue-500 hover:bg-blue-50 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor" fillRule="evenodd"
                        d="M20 4H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1ZM4 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H4Zm2 5h2v2H6V7Zm5 0a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-6Zm-3 4H6v2h2v-2Zm2 1a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1Zm-2 3H6v2h2v-2Zm2 1a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1Z"
                        clipRule="evenodd"/>
                </svg>
                <span>
                  Edit Proxy
                </span>
              </button>
              <span className="text-xs">{
                platform === 'darwin' ? '(⌘ + E)' : 'Ctrl + E'
              }</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center px-4 py-2 bg-stone-100 border-t text-xs text-gray-600 ">
          <div className="flex items-center divide-x">
            <div className="pr-2">
              lines {proxyStates?.length! || 0}
            </div>
            <div className="flex gap-2 items-center px-2">
              <span className="relative flex gap-1 h-2 w-2">
                {taskStatus === TaskStatus.RUNNING && <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>}
                <span className={clsx(
                  "relative inline-flex rounded-full h-2 w-2",
                  taskStatus === TaskStatus.RUNNING ? 'bg-green-500' : 'bg-gray-300',
                )}></span>
              </span>
              <div>
                progress {finishedCount} / {proxyStates?.length}
              </div>
              {taskStatus === TaskStatus.FINISH && (
                <div className="py-1 px-2 bg-green-100 text-green-700 rounded">
                  usable {proxyStates?.filter(item => item.speed !== null).length}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <button
              disabled={copied}
              onClick={handleCopy}
              className={clsx(
                "flex gap-2 items-center py-1 px-2 rounded-md focus:outline-none",
                copied && 'bg-green-100 text-green-700',
                !copied && 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800',
              )}
              type="button">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                <g fill="none">
                  <path
                    d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/>
                  <path fill="currentColor"
                        d="M19 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2h10Zm-4 6H5v12h10V8Zm-5 7a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h2Zm9-11H9v2h6a2 2 0 0 1 2 2v8h2V4Zm-7 7a1 1 0 0 1 .117 1.993L12 13H8a1 1 0 0 1-.117-1.993L8 11h4Z"/>
                </g>
              </svg>
              <span>
                {copied ? 'Copied Success' : 'Copy Usable'}
              </span>
            </button>
          </div>
        </div>
      <ProxyListEditDialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}/>
    </div>
  )
}