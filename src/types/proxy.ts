export type ProxyString = string;

export type ProxyInfo = {
  id: string;
  host: string;
  port: number;
  username?: string;
  password?: string;
  value: string;
}

// 合并
export type ProxyDisplayInfo = ProxyInfo & {
  speed?: number;
  status?: string;
}