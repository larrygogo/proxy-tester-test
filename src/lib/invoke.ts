import {invoke} from "@tauri-apps/api/tauri"

export function testProxyInvoke(args: {
  socks5: boolean
  proxy: string
  addr: string
  username?: string
  password?: string
}): Promise<{
  status: string
  delay: number
}> {
  return invoke("test_proxy", args)
}

export function testInterparkGlobalIndexInvoke(args: {
  socks5: boolean
  proxy: string
  username?: string
  password?: string
}): Promise<{
  status: string
  delay: number
}> {
  return invoke("test_interpark_global_index", args)
}

export function testInterparkGlobalQueueInvoke(args: {
  socks5: boolean
  proxy: string
  username?: string
  password?: string
  sku: string
}): Promise<{
  status: string
  delay: number
}> {
  return invoke("test_interpark_global_queue", args)
}

export function testMelonGlobalIndexInvoke(args: {
  socks5: boolean
  proxy: string
  username?: string
  password?: string
}): Promise<{
  status: string
  delay: number
}> {
  return invoke("test_melon_global_index", args)
}

export function testMelonGlobalPaymentInvoke(args: {
  socks5: boolean
  proxy: string
  username?: string
  password?: string
}): Promise<{
  status: string
  delay: number
}> {
  return invoke("test_melon_global_payment", args)
}
