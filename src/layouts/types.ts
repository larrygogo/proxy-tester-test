import {ReactElement, ReactNode} from "react";

export type Layout = 'vertical' | 'horizontal' | 'blank' | 'blankWithAppBar'

export type Content = 'full' | 'boxed'

export type AppBar = 'fixed' | 'static' | 'hidden'

export type Footer = 'fixed' | 'static' | 'hidden'

export type ThemeColor = {
  light: string;
  main: string;
  dark: string;
}

export type NavLink = {
  icon?: any
  path?: string
  title: string
  subject?: string
  disabled?: boolean
  badgeContent?: string
  externalLink?: boolean
  openInNewTab?: boolean
  badgeColor?: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
}

export type NavGroup = {
  icon?: any
  title: string
  subject?: string
  badgeContent?: string
  children?: (NavGroup | NavLink)[]
  badgeColor?: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
}


export type NavSectionTitle = {
  title: string
  subject?: string
}

export type NavMenu = (NavGroup | NavLink | NavSectionTitle)[]

export type LayoutProps = {
  children?: ReactNode
}


export type LayoutPageProps = {
  authGuard?: boolean
  guestGuard?: boolean
  setConfig?: () => void
  getLayout?: (page: ReactElement) => ReactNode
}

export type BlankLayoutProps = {
  children: ReactNode
}
