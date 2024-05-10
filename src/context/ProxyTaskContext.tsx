import {
  testInterparkGlobalIndexInvoke,
  testInterparkGlobalQueueInvoke,
  testMelonGlobalIndexInvoke,
  testMelonGlobalPaymentInvoke,
  testProxyInvoke,
} from "@/lib/invoke"
import {concurrencyAtom, proxyListAtom, proxyStatesAtom} from "@/lib/jotai"
import {Queue} from "@/lib/queue"
import type {ProxyStateInfo} from "@/types/proxy"
import {useAtom, useAtomValue} from "jotai"
import {nanoid} from "nanoid"
import React, {useEffect, useState} from "react"

interface LayoutContextType {
  isRunning: boolean
  proxyStates?: ProxyStateInfo[]
  setProxyStates?: React.Dispatch<React.SetStateAction<ProxyStateInfo[]>>
  startTaskWithMode?: (options: {
    mode: string
    states: ProxyStateInfo[]
    protocol: ProxyProtocol
    target?: string
    config?: Record<string, unknown>
  }) => void
  stopTask?: () => void
  taskMode?: TaskMode
}

export enum PROXY_PROTOCOL_ENUM {
  HTTP = "HTTP(s)",
  SOCKS5 = "SOCKS5",
}

export type TaskMode =
  | "normal"
  | "test_interpark_global_index"
  | "test_interpark_global_queue"
  | "test_melon_global_index"
  | "test_melon_global_payment"

export type ProxyProtocol = keyof typeof PROXY_PROTOCOL_ENUM
export const ProxyTaskContext = React.createContext<LayoutContextType>({
  isRunning: false,
})

export const ProxyTaskProvider = (props: { children: React.ReactNode }) => {
  /** Queue State */
  const [queue, setQueue] = useState<Queue>()
  const [isRunning, setIsRunning] = useState(false)

  /** Task State */
  const [mode, setMode] = useState<TaskMode>("normal")
  const [proxyStates, setProxyStates] = useAtom(proxyStatesAtom)
  const proxyList = useAtomValue(proxyListAtom)
  const concurrency = useAtomValue(concurrencyAtom)

  const startTaskWithMode = (options: {
    mode: string
    states: ProxyStateInfo[]
    protocol: ProxyProtocol
    target?: string
    config?: Record<string, unknown>
  }) => {
    const {
      mode,
      states,
      target = "www.google.com",
      protocol = "HTTP",
      config,
    } = options

    if (states.length === 0) {
      return
    }

    const queue = new Queue({
      concurrency,
    })
    setQueue(queue)

    queue.onStart = () => {
      setIsRunning(true)
    }

    queue.onStop = () => {
      setIsRunning(false)
    }

    switch (mode) {
      case "normal":
        setMode("normal")
        return normalTest({ queue, target, protocol, states })
      case "test_interpark_global_index":
        setMode("test_interpark_global_index")
        return testInterparkGlobalIndex({ queue, protocol, states })
      case "test_interpark_global_queue":
        setMode("test_interpark_global_queue")
        return testInterparkGlobalQueue({
          queue,
          protocol,
          sku: config?.sku as string,
          states,
        })
      case "test_melon_global_index":
        setMode("test_melon_global_index")
        return testMelonGlobalIndex({ queue, protocol, states })
      case "test_melon_global_payment":
        setMode("test_melon_global_payment")
        return testMelonGlobalPayment({ queue, protocol, states })
      default:
        setMode("normal")
        return normalTest({ queue, target, protocol, states })
    }
  }

  // 常规测试
  const normalTest = async (args: {
    queue: Queue
    target: string
    protocol: ProxyProtocol
    states: ProxyStateInfo[]
  }) => {
    const { queue, target, protocol, states } = args
    for (const proxy of states) {
      const task = async () => {
        const res = await testProxyInvoke({
          socks5: protocol === "SOCKS5",
          proxy: `${proxy.host}:${proxy.port.toString()}`,
          addr: formatTarget(target),
          username: proxy.username,
          password: proxy.password,
        })
        if (queue.stopped) return
        setProxyStates((s) => {
          return s.map((p) =>
            p.id === proxy.id
              ? {
                  ...p,
                  status: res.status,
                  delay: res.delay,
                }
              : p,
          )
        })
      }
      queue.addTask(task)
    }
    await queue.start()
  }

  const testInterparkGlobalIndex = async (args: {
    queue: Queue
    protocol: ProxyProtocol
    states: ProxyStateInfo[]
  }) => {
    const { queue, protocol, states } = args
    for (const proxy of states) {
      const task = async () => {
        const res = await testInterparkGlobalIndexInvoke({
          socks5: protocol === "SOCKS5",
          proxy: `${proxy.host}:${proxy.port.toString()}`,
          username: proxy.username,
          password: proxy.password,
        })
        if (queue.stopped) return
        setProxyStates((s) =>
          s.map((p) =>
            p.id === proxy.id
              ? {
                  ...p,
                  status: res.status,
                  delay: res.delay,
                }
              : p,
          ),
        )
      }
      queue.addTask(task)
    }
    await queue.start()
  }

  const testInterparkGlobalQueue = async (args: {
    queue: Queue
    protocol: ProxyProtocol
    sku: string
    states: ProxyStateInfo[]
  }) => {
    const { queue, protocol, sku, states } = args
    for (const proxy of states) {
      const task = async () => {
        const res = await testInterparkGlobalQueueInvoke({
          socks5: protocol === "SOCKS5",
          proxy: `${proxy.host}:${proxy.port.toString()}`,
          username: proxy.username,
          password: proxy.password,
          sku,
        })
        if (queue.stopped) return
        setProxyStates((s) =>
          s.map((p) =>
            p.id === proxy.id
              ? {
                  ...p,
                  status: res.status,
                  delay: res.delay,
                }
              : p,
          ),
        )
      }
      queue.addTask(task)
    }
    await queue.start()
  }
  const testMelonGlobalIndex = async (args: {
    queue: Queue
    protocol: ProxyProtocol
    states: ProxyStateInfo[]
  }) => {
    const { queue, protocol, states } = args
    for (const proxy of states) {
      const task = async () => {
        const res = await testMelonGlobalIndexInvoke({
          socks5: protocol === "SOCKS5",
          proxy: `${proxy.host}:${proxy.port.toString()}`,
          username: proxy.username,
          password: proxy.password,
        })
        if (queue.stopped) return
        setProxyStates((s) =>
          s.map((p) =>
            p.id === proxy.id
              ? {
                  ...p,
                  status: res.status,
                  delay: res.delay,
                }
              : p,
          ),
        )
      }
      queue.addTask(task)
    }
    await queue.start()
  }

  const testMelonGlobalPayment = async (args: {
    queue: Queue
    protocol: ProxyProtocol
    states: ProxyStateInfo[]
  }) => {
    const { queue, protocol, states } = args
    for (const proxy of states) {
      const task = async () => {
        const res = await testMelonGlobalPaymentInvoke({
          socks5: protocol === "SOCKS5",
          proxy: `${proxy.host}:${proxy.port.toString()}`,
          username: proxy.username,
          password: proxy.password,
        })
        if (queue.stopped) return
        setProxyStates((s) =>
          s.map((p) =>
            p.id === proxy.id
              ? {
                ...p,
                status: res.status,
                delay: res.delay,
              }
              : p,
          ),
        )
      }
      queue.addTask(task)
    }
    await queue.start()
  }

  const stopTask = () => {
    setIsRunning(false)
    queue?.stop()
  }

  useEffect(() => {
    if (!proxyStates) {
      setProxyStates(
        proxyList.map((proxy) => {
          const [host, port, username, password] = proxy.split(":")
          return {
            id: nanoid(),
            host,
            port: Number(port),
            username,
            password,
            value: proxy,
          }
        }) ?? [],
      )
    }
  }, [proxyList, proxyStates, setProxyStates])

  return (
    <ProxyTaskContext.Provider
      value={{
        isRunning,
        proxyStates,
        setProxyStates: setProxyStates,
        startTaskWithMode,
        taskMode: mode,
        stopTask,
      }}
    >
      {typeof window !== "undefined" ? props.children : null}
    </ProxyTaskContext.Provider>
  )
}

const formatTarget = (target: string) => {
  if (/^http(s)?:\/\//.test(target)) {
    return target
  }
  return `https://${target}`
}
