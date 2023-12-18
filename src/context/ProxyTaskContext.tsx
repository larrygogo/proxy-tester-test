'use client';
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {TaskPool} from "@/utils/task";
import {ProxyDisplayInfo} from "@/types/proxy";
import {Store} from "tauri-plugin-store-api";
import {v4 as randomUUID} from "uuid";
import {invoke} from "@tauri-apps/api";

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
}

export enum TaskStatus {
  WAITING = 'waiting',
  RUNNING = 'running',
  FINISH = 'stop',
}

export enum ProxyProtocol {
  HTTP = 'http',
  SOCKS5 = 'socks5',
}

export const ProxyTaskContext = React.createContext<LayoutContextType>({});

export const ProxyTaskProvider = (props: { children: React.ReactNode }) => {
  const [protocol, setProtocol] = useState<ProxyProtocol>(ProxyProtocol.HTTP)
  const [proxyList, setProxyList] = useState<string[]>([])
  const [target, setTarget] = useState<string>('')
  const [proxyStates, setProxyStates] = useState<ProxyDisplayInfo[]>([])
  const [finishedCount, setFinishedCount] = useState(0)
  const [concurrency, setConcurrency] = useState(20)
  const [taskStatus, setTaskStatus] = useState<TaskStatus>(TaskStatus.WAITING)
  const store = useMemo(() => new Store(".settings.task"), [])

  const taskPool = TaskPool.getInstance()


  const startTask = async () => {
    if (taskStatus === TaskStatus.RUNNING) return
    setFinishedCount(0)
    setTaskStatus(TaskStatus.RUNNING)
    taskPool.clear()
    setProxyStates((prev) => prev.map(p => ({...p, status: undefined, speed: undefined})))

    for (let proxy of proxyStates) {
      const task = async () => {
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

  const stopTask = () => {
    console.log('handleStop')
  }

  const changeProxyList = useCallback(async (list: string[]) => {
    await store.set("proxy.list", list)
    await store.save()

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
    setProxyStates(statesList)
    setProxyList(list)
  }, [store])

  const changeTarget = useCallback(async (target: string) => {
    await store.set("proxy.target", target)
    await store.save()
    setTarget(target)
  }, [store])

  const changeProtocol = useCallback(async (protocol: ProxyProtocol) => {
    await store.set("proxy.protocol", protocol)
    await store.save()
    setProtocol(protocol)
  }, [store])

  const changeConcurrency = useCallback(async (concurrency: number) => {
    await store.set("task.concurrency", concurrency)
    await store.save()
    setConcurrency(concurrency)
    taskPool.setConcurrency(concurrency)
  }, [store, taskPool])

  useEffect(() => {
    (async () => {
      // 加载 Proxy List 缓存
      const proxyListStoreData = await store.get("proxy.list")
      if (proxyListStoreData instanceof Array) {
        await changeProxyList(proxyListStoreData)
      } else {
        await changeProxyList([])
      }

      // 加载 Task 并发数缓存
      const taskConcurrency = await store.get("task.concurrency")
      if (typeof taskConcurrency === 'number') {
        await changeConcurrency(taskConcurrency)
      } else {
        await changeConcurrency(20)
      }

      // 加载 Target 缓存
      const targetStoreData = await store.get('proxy.target')
      if (typeof targetStoreData === 'string') {
        await changeTarget(targetStoreData)
      } else {
        await changeTarget('')
      }

      // 加载 Protocol 缓存
      const protocolStoreData = await store.get('proxy.protocol')
      if (typeof protocolStoreData === 'string') {
        await changeProtocol(protocolStoreData as ProxyProtocol)
      } else {
        await changeProtocol(ProxyProtocol.HTTP)
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
      setTarget: changeTarget,
      setProtocol: changeProtocol,
      setConcurrency: changeConcurrency,
    }}>
      {typeof window !== 'undefined' ? props.children : null}
    </ProxyTaskContext.Provider>
  )
}
