"use client"
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {TaskPool} from "@/lib/task";
import {ProxyDisplayInfo} from "@/types/proxy";
import {v4 as randomUUID} from "uuid";

type LayoutContextType = {
  taskPool?: TaskPool
  startTask?: () => void
  stopTask?: () => void
  concurrency?: number
  proxyList?: string[]
  protocol?: ProxyProtocol
  target?: string
  proxyStates?: ProxyDisplayInfo[]
  finishedCount?: number
  taskStatus?: TaskStatus
  setProxyList?: (proxyList: string[]) => void
  setProtocol?: (protocol: ProxyProtocol) => void
  setTarget?: (target: string) => void
  setProxyStates?: (proxyStates: ProxyDisplayInfo[]) => void
  setFinishedCount?: (finishedCount: number) => void
  setConcurrency?: (concurrency: number) => void
  startTaskWithMode?: (mode: string, data?: Record<string, any>) => void
}

export enum TaskStatus {
  WAITING = 'waiting',
  RUNNING = 'running',
  FINISH = 'stop',
}

export enum ProxyProtocolEnum {
  http = "HTTP(s)",
  socks5 = "SOCKS5",
}

export type ProxyProtocol = keyof typeof ProxyProtocolEnum

export const ProxyTaskContext = React.createContext<LayoutContextType>({});

export const ProxyTaskProvider = (props: { children: React.ReactNode }) => {
  const [protocol, setProtocol] = useState<ProxyProtocol>('http')
  const [proxyList, setProxyList] = useState<string[]>([])
  const [target, setTarget] = useState<string>('')
  const [proxyStates, setProxyStates] = useState<ProxyDisplayInfo[]>([])
  const [finishedCount, setFinishedCount] = useState(0)
  const [concurrency, setConcurrency] = useState(20)
  const [taskStatus, setTaskStatus] = useState<TaskStatus>(TaskStatus.WAITING)
  const store = useMemo(() => ({
    set: localStorage.setItem.bind(localStorage),
    get: localStorage.getItem.bind(localStorage),

  }), [])

  const taskPool = TaskPool.getInstance()

  const startTask = async () => {
    await startTaskWithMode('normal')
  }

  const startTaskWithMode = async (mode: string = 'normal', config?: Record<string, any>) => {
    console.log('startTaskWithMode', mode)
    // 如果任务正在运行，则直接返回
    if (taskStatus === TaskStatus.RUNNING) return

    // 设置初始状态
    setFinishedCount(0)
    setTaskStatus(TaskStatus.RUNNING)
    taskPool.clear()
    setProxyStates((prev) => prev.map(p => ({...p, status: undefined, speed: undefined})))

    taskPool.on('progress', (({completed, total}) => {
      setFinishedCount(completed)
      if (completed === total) {
        setTaskStatus(TaskStatus.FINISH)
        taskPool.stop()
      }
    }))

    switch (mode) {
      case 'normal':
        return normalTest()
      case 'test_interpark_global_index':
        return testInterparkGlobalIndex()
      case 'test_interpark_global_queue':
        return testInterparkGlobalQueue(config?.sku)
      case 'test_melon_global_index':
        return testMelonGlobalIndex()
      default:
        return normalTest()
    }
  }

  // 常规测试
  const normalTest = async () => {
    for (let proxy of proxyStates) {
      const task = async () => {
        // 判断 target 是否以 http(s):// 开头，默认添加 https://
        const formatTarget = (target: string) => {
          if (target.startsWith('http://') || target.startsWith('https://')) {
            return target
          }
          return 'https://' + target
        }
        const {invoke} = await import("@tauri-apps/api/tauri")

        const result: { status: string, delay: number } = await invoke("test_proxy", {
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
    taskPool.start()

  }

  const testInterparkGlobalIndex = async () => {
    for (let proxy of proxyStates) {
      const task = async () => {
        const {invoke} = await import("@tauri-apps/api/tauri")

        const result: { status: string, delay: number } = await invoke("test_interpark_global_index", {
          socks5: protocol === 'socks5',
          proxy: proxy.host + ':' + proxy.port,
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
    taskPool.start()
  }

  const testInterparkGlobalQueue = async (sku: string) => {
    for (let proxy of proxyStates) {
      const task = async () => {
        const {invoke} = await import("@tauri-apps/api/tauri")

        const result: { status: string, delay: number } = await invoke("test_interpark_global_queue", {
          socks5: protocol === 'socks5',
          proxy: proxy.host + ':' + proxy.port,
          username: proxy.username,
          password: proxy.password,
          sku: sku
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
    taskPool.start()
  }
  const testMelonGlobalIndex = async () => {
    for (let proxy of proxyStates) {
      const task = async () => {
        const {invoke} = await import("@tauri-apps/api/tauri")

        const result: { status: string, delay: number } = await invoke("test_melon_global_index", {
          socks5: protocol === 'socks5',
          proxy: proxy.host + ':' + proxy.port,
          username: proxy.username,
          password: proxy.password,
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
    taskPool.start()
  }


  const stopTask = () => {
    taskPool.stop()
    setTaskStatus(TaskStatus.FINISH)
  }

  const changeProxyList = useCallback(async (list: string[]) => {
    if (!store) return
    store.set("proxy.list", JSON.stringify(list))

    const statesList = list?.map((p) => {
      const [host, port, username, password] = p.split(':')
      return {
        id: randomUUID(),
        host,
        port: Number(port),
        username,
        password,
        value: p,
      } as ProxyDisplayInfo
    }) || []
    console.log("1111", statesList)
    setProxyStates(statesList)
    setProxyList(list)
  }, [store])

  const changeTarget = useCallback(async (target: string) => {
    if (!store) return
    store.set("proxy.target", JSON.stringify(target))
    setTarget(target)
  }, [store])

  const changeProtocol = useCallback(async (protocol: ProxyProtocol) => {
    if (!store) return
    store.set("proxy.protocol", JSON.stringify(protocol))
    setProtocol(protocol)
  }, [store])

  const changeConcurrency = useCallback(async (concurrency: number) => {
    if (!store) return
    store.set("task.concurrency", concurrency.toString())
    setConcurrency(concurrency)
    taskPool.setConcurrency(concurrency)
  }, [store, taskPool])

  useEffect(() => {
    (async () => {
      // 加载 Proxy List 缓存
      const proxyListStoreData = JSON.parse(store.get('proxy.list') || '[]')
      if (proxyListStoreData instanceof Array) {
        await changeProxyList(proxyListStoreData)
      } else {
        await changeProxyList([])
      }

      // 加载 Task 并发数缓存
      const taskConcurrency = Number(store.get('task.concurrency') || 20)
      await changeConcurrency(taskConcurrency)


      // 加载 Target 缓存
      const targetStoreData = JSON.parse(store.get('proxy.target') || '""')
      if (typeof targetStoreData === 'string') {
        await changeTarget(targetStoreData)
      } else {
        await changeTarget('')
      }

      // 加载 Protocol 缓存
      const protocolStoreData =  JSON.parse(store.get('proxy.protocol') || '"http"')
      if (typeof protocolStoreData === 'string') {
        await changeProtocol(protocolStoreData as ProxyProtocol)
      } else {
        await changeProtocol('http')
      }
    })()

  }, [changeConcurrency, changeProtocol, changeProxyList, changeTarget, store]);

  return (
    <ProxyTaskContext.Provider value={{
      taskPool,
      startTask: startTask,
      stopTask: stopTask,
      proxyList,
      concurrency,
      target,
      protocol,
      proxyStates,
      finishedCount,
      taskStatus,
      setProxyList: changeProxyList,
      setProxyStates: setProxyStates,
      setTarget: changeTarget,
      setProtocol: changeProtocol,
      setConcurrency: changeConcurrency,
      startTaskWithMode: startTaskWithMode
    }}>
      {typeof window !== 'undefined' ? props.children : null}
    </ProxyTaskContext.Provider>
  )
}
