export type ProxyString = string

export interface ProxyInfo {
  id: string
  host: string
  port: number
  username?: string
  password?: string
  value: string
}

// 合并
export type ProxyDisplayInfo = ProxyInfo & {
  speed?: number
  status?: string
}

export type ProxyType = "http" | "socks5"
