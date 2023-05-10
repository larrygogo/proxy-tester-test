import {createContext, ReactNode, useEffect, useState} from "react";

export type SettingsContextValue = {
  settings: Settings
  saveSettings: (data: Partial<Settings>) => void
}

const initialSettings: Settings = {
  concurrency: 5,
  socks5: false
}

const defaultSettingContext: SettingsContextValue = {
  settings: initialSettings,
  saveSettings: () => null
}

const storeSetting = (data: Settings) => {
  const dataCopy = Object.assign(defaultSettingContext, data)
  localStorage.setItem('setting', JSON.stringify(dataCopy))
}

const loadSetting = (): Settings => {
  const data = localStorage.getItem('setting')
  if (data) {
    return JSON.parse(data)
  }
  return initialSettings
}

export const SettingsContext = createContext<SettingsContextValue>({} as SettingsContextValue)

export const SettingsProvider = ({children}: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(initialSettings)

  const saveSettings = (data: Partial<Settings>) => {
    const dataCopy = Object.assign(initialSettings, data)
    setSettings(dataCopy)
    storeSetting(dataCopy)
  }

  useEffect(() => {
    const data = loadSetting()
    setSettings(data)
  }, [])

  return (
    <SettingsContext.Provider value={{
      settings,
      saveSettings
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

