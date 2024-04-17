import type { ProxyProtocol } from "@/context/ProxyTaskContext"
import type { ProxyStateInfo } from "@/types/proxy"
import { atomWithStorage } from "jotai/utils"

export const concurrencyAtom = atomWithStorage<number>("task.concurrency", 20)
export const targetAtom = atomWithStorage("task.target", "")
export const protocolAtom = atomWithStorage<ProxyProtocol>(
  "task.protocol",
  "HTTP",
)
export const proxyListAtom = atomWithStorage<string[]>("task.proxyList", [])
export const proxyStatesAtom = atomWithStorage<ProxyStateInfo[]>(
  "task.proxyStates",
  [],
)
