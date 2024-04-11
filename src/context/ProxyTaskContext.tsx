"use client"
import { TaskPool } from "@/lib/task"
import type { ProxyDisplayInfo } from "@/types/proxy"
import { invoke } from "@tauri-apps/api/tauri"
import { nanoid } from "nanoid"
import React, { useCallback, useEffect, useMemo, useState } from "react"

interface LayoutContextType {
  taskPool?: TaskPool
  startTask?: () => Promise<void>
  stopTask?: () => void
  concurrency?: number
  proxyList?: string[]
  protocol?: ProxyProtocol
  target?: string
  proxyStates?: ProxyDisplayInfo[]
  finishedCount?: number
  taskStatus?: TASK_STATUS_ENUM
  setProxyList?: (proxyList: string[]) => void
  setProtocol?: (protocol: ProxyProtocol) => void
  setTarget?: (target: string) => void
  setProxyStates?: (proxyStates: ProxyDisplayInfo[]) => void
  setFinishedCount?: (finishedCount: number) => void
  setConcurrency?: (concurrency: number) => void
  startTaskWithMode?: (
    mode: string,
    data?: Record<string, unknown>,
  ) => Promise<void>
  taskMode?: TASK_MODE_ENUM
}

export enum TASK_STATUS_ENUM {
  RUNNING = "running",
  PENDING = "pending",
}

export enum PROXY_PROTOCOL_ENUM {
  HTTP = "HTTP(s)",
  SOCKS5 = "SOCKS5",
}

export enum TASK_MODE_ENUM {
  NORMAL = "normal",
  TEST_INTERPARK_GLOBAL_INDEX = "test_interpark_global_index",
  TEST_INTERPARK_GLOBAL_QUEUE = "test_interpark_global_queue",
  TEST_MELON_GLOBAL_INDEX = "test_melon_global_index",
}

export type ProxyProtocol = keyof typeof PROXY_PROTOCOL_ENUM
export const ProxyTaskContext = React.createContext<LayoutContextType>({})

export const ProxyTaskProvider = (props: { children: React.ReactNode }) => {
  const [protocol, setProtocol] = useState<ProxyProtocol>("HTTP")
  const [proxyList, setProxyList] = useState<string[]>([])
  const [target, setTarget] = useState<string>("")
  const [taskMode, setTaskMode] = useState<TASK_MODE_ENUM>(
    TASK_MODE_ENUM.NORMAL,
  )
  const [taskStatus, setTaskStatus] = useState<TASK_STATUS_ENUM>(
    TASK_STATUS_ENUM.PENDING,
  )
  const [proxyStates, setProxyStates] = useState<ProxyDisplayInfo[]>([])
  const [finishedCount, setFinishedCount] = useState(0)
  const [concurrency, setConcurrency] = useState(20)
  const store = useMemo(() => {
    if (typeof window === "undefined") return null
    return {
      set: localStorage.setItem.bind(localStorage),
      get: localStorage.getItem.bind(localStorage),
    }
  }, [])
  const taskPool = TaskPool.getInstance()

  taskPool.on("stop", () => {
    console.log("taskPool stop")
    setTaskStatus(TASK_STATUS_ENUM.PENDING)
  })

  taskPool.on("start", () => {
    console.log("taskPool start")
    setTaskStatus(TASK_STATUS_ENUM.RUNNING)
  })

  const startTask = async () => {
    if (taskStatus === TASK_STATUS_ENUM.RUNNING) {
      return
    }

    if (!target || !proxyList.length || !concurrency || !protocol) {
      return
    }

    setTaskStatus(TASK_STATUS_ENUM.RUNNING)
    await startTaskWithMode(TASK_MODE_ENUM.NORMAL)
  }

  const startTaskWithMode = (
    mode: string = TASK_MODE_ENUM.NORMAL,
    config?: Record<string, unknown>,
  ) => {
    // 如果任务正在运行，则直接返回

    // 设置初始状态
    setFinishedCount(0)
    taskPool.clear()
    setProxyStates((prev) =>
      prev.map((p) => ({ ...p, status: undefined, speed: undefined })),
    )

    taskPool.on(
      "progress",
      (
        data = {
          completed: 0,
          total: 0,
        },
      ) => {
        const { completed, total } = data as {
          completed: number
          total: number
        }
        setFinishedCount(completed)
        if (completed === total) {
          taskPool.stop()
        }
      },
    )
    switch (mode) {
      case "normal":
        setTaskMode(TASK_MODE_ENUM.NORMAL)
        return normalTest()
      case "test_interpark_global_index":
        setTaskMode(TASK_MODE_ENUM.TEST_INTERPARK_GLOBAL_INDEX)
        return testInterparkGlobalIndex()
      case "test_interpark_global_queue":
        setTaskMode(TASK_MODE_ENUM.TEST_INTERPARK_GLOBAL_QUEUE)
        return testInterparkGlobalQueue(config?.sku as string)
      case "test_melon_global_index":
        setTaskMode(TASK_MODE_ENUM.TEST_MELON_GLOBAL_INDEX)
        return testMelonGlobalIndex()
      default:
        setTaskMode(TASK_MODE_ENUM.NORMAL)
        return normalTest()
    }
  }

  // 常规测试
  const normalTest = async () => {
    for (const proxy of proxyStates) {
      const task = async () => {
        // 判断 target 是否以 http(s):// 开头，默认添加 https://
        const formatTarget = (target: string) => {
          if (target.startsWith("http://") || target.startsWith("https://")) {
            return target
          }
          return `https://${target}`
        }
        const result: { status: string; delay: number } = await invoke(
          "test_proxy",
          {
            socks5: protocol === "SOCKS5",
            proxy: `${proxy.host}:${proxy.port.toString()}`,
            addr: formatTarget(target),
            username: proxy.username,
            password: proxy.password,
          },
        )
        if (!taskPool.stopped) {
          setProxyStates((prev) =>
            prev.map((p) =>
              p.id === proxy.id
                ? {
                    ...p,
                    status: result.status,
                    delay: result.delay,
                  }
                : p,
            ),
          )
        }
      }
      taskPool.addTask(task)
    }
    await taskPool.start()
  }

  const testInterparkGlobalIndex = async () => {
    for (const proxy of proxyStates) {
      const task = async () => {
        const result: { status: string; delay: number } = await invoke(
          "test_interpark_global_index",
          {
            socks5: protocol === "SOCKS5",
            proxy: `${proxy.host}:${proxy.port.toString()}`,
            username: proxy.username,
            password: proxy.password,
          },
        )
        if (!taskPool.stopped) {
          setProxyStates((prev) =>
            prev.map((p) =>
              p.id === proxy.id
                ? {
                    ...p,
                    status: result.status,
                    delay: result.delay,
                  }
                : p,
            ),
          )
        }
        return result
      }
      taskPool.addTask(task)
    }
    await taskPool.start()
  }

  const testInterparkGlobalQueue = async (sku: string) => {
    for (const proxy of proxyStates) {
      const task = async () => {
        const result: { status: string; delay: number } = await invoke(
          "test_interpark_global_queue",
          {
            socks5: protocol === "SOCKS5",
            proxy: `${proxy.host}:${proxy.port.toString()}`,
            username: proxy.username,
            password: proxy.password,
            sku: sku,
          },
        )
        if (!taskPool.stopped) {
          setProxyStates((prev) =>
            prev.map((p) =>
              p.id === proxy.id
                ? {
                    ...p,
                    status: result.status,
                    delay: result.delay,
                  }
                : p,
            ),
          )
        }
        return result
      }
      taskPool.addTask(task)
    }
    await taskPool.start()
  }
  const testMelonGlobalIndex = async () => {
    for (const proxy of proxyStates) {
      const task = async () => {
        const result: { status: string; delay: number } = await invoke(
          "test_melon_global_index",
          {
            socks5: protocol === "SOCKS5",
            proxy: `${proxy.host}:${proxy.port.toString()}`,
            username: proxy.username,
            password: proxy.password,
          },
        )
        if (!taskPool.stopped) {
          setProxyStates((prev) =>
            prev.map((p) =>
              p.id === proxy.id
                ? {
                    ...p,
                    status: result.status,
                    delay: result.delay,
                  }
                : p,
            ),
          )
        }
        return result
      }
      taskPool.addTask(task)
    }
    await taskPool.start()
  }

  const stopTask = () => {
    taskPool.stop()
  }

  const changeProxyList = useCallback(
    (list: string[]) => {
      if (!store) return
      store.set("proxy.list", JSON.stringify(list))

      const statesList = list.map((p) => {
        const [host, port, username, password] = p.split(":")
        return {
          id: nanoid(),
          host,
          port: Number(port),
          username,
          password,
          value: p,
        } as ProxyDisplayInfo
      })
      setProxyStates(statesList)
      setProxyList(list)
    },
    [store],
  )

  const changeTarget = useCallback(
    (target: string) => {
      if (!store) return
      store.set("proxy.target", JSON.stringify(target))
      setTarget(target)
    },
    [store],
  )

  const changeProtocol = useCallback(
    (protocol: ProxyProtocol) => {
      if (!store) return
      store.set("proxy.protocol", JSON.stringify(protocol))
      setProtocol(protocol)
    },
    [store],
  )

  const changeConcurrency = useCallback(
    (concurrency: number) => {
      if (!store) return
      store.set("task.concurrency", concurrency.toString())
      setConcurrency(concurrency)
      taskPool.setConcurrency(concurrency)
    },
    [store, taskPool],
  )

  useEffect(() => {
    // 加载 Proxy List 缓存
    const proxyListStoreData = Array.from(
      JSON.parse(store?.get("proxy.list") ?? "[]") as string[],
    )
    changeProxyList(proxyListStoreData)
    // 加载 Task 并发数缓存
    const taskConcurrency = Number(
      JSON.parse(store?.get("task.concurrency") ?? "20"),
    )
    changeConcurrency(taskConcurrency)

    // 加载 Target 缓存
    const targetStoreData = String(
      JSON.parse(store?.get("proxy.target") ?? '""'),
    )
    changeTarget(targetStoreData)

    // 加载 Protocol 缓存
    const protocolStoreData = String(
      JSON.parse(store?.get("proxy.protocol") ?? '"HTTP"'),
    )
    changeProtocol(protocolStoreData as ProxyProtocol)
  }, [changeConcurrency, changeProtocol, changeProxyList, changeTarget, store])

  return (
    <ProxyTaskContext.Provider
      value={{
        taskPool,
        startTask,
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
        startTaskWithMode,
        taskMode,
      }}
    >
      {typeof window !== "undefined" ? props.children : null}
    </ProxyTaskContext.Provider>
  )
}
