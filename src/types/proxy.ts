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
export type ProxyStateInfo = ProxyInfo & {
  delay?: number
  status?: string
}

export type ProxyType = "http" | "socks5"
