export type ProxyString = string;

export type ProxyInfo = {
  id: string;
  host: string;
  port: string;
  username?: string;
  password?: string;
}

// 合并
export type ProxyDisplayInfo = ProxyInfo & {
  speed?: string;
  status?: string;
}