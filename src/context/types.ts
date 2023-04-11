import {ReactNode} from "react";
import {ThemeColor} from "@/layouts/types";
import {PaletteMode} from "@mui/material";

export type LayoutConfig = {
  name?: string
  logo?: string
  mode: PaletteMode
  themeColor: ThemeColor
}

export type LayoutContextValue = {
  config: LayoutConfig
  saveConfig: (theme: LayoutConfig) => void
}

export type TemplateProviderProps = {
  initConfig?: LayoutConfig
  children: ReactNode
}

export type AuthContextOptions = {
  storageKey: string
  currentUserUrl: string
  loginUrl: string
  registerUrl: string
  logoutUrl: string
}

export type AuthContextValue<T = any> = {
  loading: boolean
  userInfo: T
  setUserInfo: (value: T) => void
  options: AuthContextOptions
  saveOptions: (options: AuthContextOptions) => void
  login: (data: any) => Promise<any>
  logout: () => Promise<any>
  register: (data: any) => Promise<any>
}

