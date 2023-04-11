import {LayoutConfig, LayoutContextValue, TemplateProviderProps} from "./types";
import {createContext, useEffect, useState} from "react";
import initialConfig from '@/configs/layout'
// 缓存设置
const storeConfig = (theme: LayoutConfig) => {
  const initTheme = Object.assign({}, theme)
  window.localStorage.setItem('layoutConfig', JSON.stringify(initTheme))
}


// 恢复设置
const restoreConfig = (): LayoutConfig | null => {
  let template = null
  try {
    const storedData: string | null = window.localStorage.getItem('layoutConfig')
    if (storedData) {
      template = { ...JSON.parse(storedData) }
    } else {
      template = initialConfig
    }
  } catch (err) {
    console.error(err)
  }
  return template
}

export const LayoutContext = createContext<LayoutContextValue>({
  saveConfig: () => null,
  config: initialConfig
})

export const LayoutProvider = ({children, initConfig}: TemplateProviderProps) => {
  const [config, setConfig] = useState<LayoutConfig>({...initialConfig,...initConfig})

  useEffect(() => {
    let restoredLayoutConfig = restoreConfig()
    if (restoredLayoutConfig) {
      setConfig({ ...restoredLayoutConfig })
    }
  }, [])

  // ** Save Settings
  const saveConfig = (data: LayoutConfig) => {
    setConfig(data)
    storeConfig(data)
  }

  // ** Render Provider
  return (
    <LayoutContext.Provider value={{config, saveConfig}}>
      {children}
    </LayoutContext.Provider>
  )
}

export const TemplateConsumer = LayoutContext.Consumer
