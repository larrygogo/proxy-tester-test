'use client'
import TargetInput from "@/components/target-input";
import {useEffect, useState} from "react";
import clsx from "clsx";
import ProxyListEditDialog from "@/components/proxy-list-edit-dialog";
import {ProxyDisplayInfo} from "@/types/proxy";
import {v4 as randomUUID} from "uuid";
import {TaskPool} from "@/utils/task";
import ScrollBar from "react-perfect-scrollbar";
import EmptyProxy from "@/components/empty-proxy";
import "react-perfect-scrollbar/dist/css/styles.css";

const taskPool = TaskPool.getInstance({
  concurrency: 20,
})

enum TaskStatus {
  WAITING = 'waiting',
  RUNNING = 'running',
  FINISH = 'stop',
}

export default function Page() {
  const [importOpen, setImportOpen] = useState(false)
  const [target, setTarget] = useState<string>('www.google.com')
  const [protocol, setProtocol] = useState<string>('http')
  const [proxyList, setProxyList] = useState<string[]>([])
  const [proxyStates, setProxyStates] = useState<ProxyDisplayInfo[]>([])
  const [finishedCount, setFinishedCount] = useState(0)
  const [taskStatus, setTaskStatus] = useState<TaskStatus>(TaskStatus.WAITING)
  const [copied, setCopied] = useState(false)
  const [showShadow, setShowShadow] = useState(false)

  const handleInfiniteScroll = (ref: HTMLElement) => {
    if (ref) {
      // @ts-ignore
      ref._getBoundingClientRect = ref.getBoundingClientRect

      ref.getBoundingClientRect = () => {
        // @ts-ignore
        const original = ref._getBoundingClientRect()

        return {...original, height: Math.floor(original.height)}
      }
    }
  }

  const scrollMenu = (container: any) => {
    if(container) {
      if(container.scrollTop > 0) {
        setShowShadow(true)
      } else {
        setShowShadow(false)
      }
    }
  }


  useEffect(() => {
    import('@tauri-apps/api/globalShortcut').then(async ({register, isRegistered}) => {
      if (!(await isRegistered('CmdOrCtrl+E'))) {
        await register('CmdOrCtrl+E', () => setImportOpen(v => !v))
      }
    })
  }, []);

  const handleListChange = (proxyList: string[]) => {
    setProxyList(proxyList)
    setFinishedCount(0)
    setTaskStatus(TaskStatus.WAITING)
    setImportOpen(false)
  }

  const handleCopy = async () => {
    const text = proxyStates?.filter(p => p.status === 'OK').map(p => p.value).join('\n')
    await navigator.clipboard.writeText(text || '')
    setCopied(true)
  }

  const handleStart = async () => {
    if (taskStatus === TaskStatus.RUNNING) return
    setFinishedCount(0)
    setTaskStatus(TaskStatus.RUNNING)
    taskPool.clear()
    setProxyStates((prev) => prev.map(p => ({...p, status: undefined, speed: undefined})))

    for (let proxy of proxyStates) {
      const task = async () => {
        const invoke = (await import("@tauri-apps/api/tauri")).invoke
        // 判断 target 是否以 http(s):// 开头
        const formatTarget = (target: string) => {
          if (target.startsWith('http://') || target.startsWith('https://')) {
            return target
          }
          return 'https://' + target
        }

        const result: { status: string, delay: number } = await invoke('test_proxy', {
          socks5: protocol === 'socks5',
          proxy: proxy.host + ':' + proxy.port,
          addr: formatTarget(target),
          username: proxy.username,
          password: proxy.password
        })
        setProxyStates((prev) => prev.map(p => p.id === proxy.id ? {
          ...p,
          status: result.status,
          speed: result?.delay
        } : p))
        return result as any
      }
      await taskPool.addTask(task)
    }
    taskPool.on('progress', (({completed, total}) => {
      setFinishedCount(completed)
      if (completed === total) {
        setTaskStatus(TaskStatus.FINISH)
        taskPool.stop()
      }
    }))
    await taskPool.start()
  }

  useEffect(() => {
    const storageValue = localStorage.getItem('proxyList')
    try {
      const value = JSON.parse(storageValue ?? '').filter(Boolean)
      setProxyList(value)
    } catch (e) {
      localStorage.removeItem('proxyList')
    }
  }, []);

  useEffect(() => {
    const list = proxyList?.map((p) => {
      const [host, port, username, password] = p.split(':')
      return {
        id: randomUUID(),
        host,
        port: Number(port),
        username,
        password,
        value: p,
      } as ProxyDisplayInfo
    })

    setProxyStates(list || [])
  }, [proxyList]);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 3000)
    }
  }, [copied]);

  return (
    <div className="flex flex-col h-full bg-white rounded-t-lg overflow-hidden">
      <div className={clsx(
        "py-4 px-4 bg-white z-10",
        showShadow && "shadow border-b border-gray-200 z-10"
      )}>
        <TargetInput
          target={target}
          onTargetChange={(v) => setTarget(v)}
          protocol={protocol}
          onProtocolChange={(v) => setProtocol(v)}
          onStart={handleStart}
          onEdit={() => setImportOpen(true)}/>
      </div>
      {proxyStates.length === 0 && (
        <div className="flex-1 flex items-center justify-center w-full">
          <EmptyProxy/>
        </div>
      )}
      {proxyStates.length > 0 && (
        <div className="overflow-hidden relative">
          <ScrollBar onScrollY={scrollMenu} containerRef={handleInfiniteScroll}>
            <div className="flex flex-col gap-2 px-4 pb-4">
              {proxyStates.map((_) => (
                <div key={_.id} className={clsx(
                  "flex gap-4 justify-between text-sm border py-1.5 px-4 rounded-lg bg-gray-50",
                  _.status === 'TIMEOUT' && 'bg-red-50 border-red-100',
                )}>
                  <div className="truncate cursor-default" title={_.value}>
                    {_.value}
                  </div>
                  <div className={clsx(
                    "w-1/5 text-right",
                    _.status !== 'OK' && _.speed !== undefined && 'text-red-700',
                    _.status === 'OK' && _.speed !== undefined && 'text-green-700',
                  )}>
                    {_.speed !== undefined && _.speed !== null && `${_.speed}ms`}
                    {_.speed !== undefined && _.speed === null && _.status}
                  </div>
                </div>
              ))}
            </div>
          </ScrollBar>
        </div>
      )}
      <div className="">
        <div className="flex justify-between items-center px-4 py-2 bg-stone-100 border-t text-xs text-gray-600 ">
          <div className="flex items-center divide-x">
            <div className="pr-2">
              lines {proxyList?.length}
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
                progress {finishedCount} / {proxyList?.length}
              </div>
              {taskStatus === TaskStatus.FINISH && (
                <div className="py-1 px-2 bg-green-100 text-green-700 rounded">
                  usable {proxyStates.filter(item => item.speed !== null).length}
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
      </div>
      <ProxyListEditDialog open={importOpen} onSave={handleListChange} onClose={() => setImportOpen(false)}/>
    </div>
  )
}