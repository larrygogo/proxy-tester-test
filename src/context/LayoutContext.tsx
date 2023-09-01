'use client';
import {Platform} from "@tauri-apps/api/os";
import React, {useEffect} from "react";
import {os} from "@tauri-apps/api";

type LayoutContextType = {
  platform?: Platform
}

export const LayoutContext = React.createContext<LayoutContextType>({});

export const LayoutProvider = (props: { children: React.ReactNode }) => {
  const [platform, setPlatform] = React.useState<Platform>();

  useEffect(() => {
    (async () => {
      const p = await os.platform()
      setPlatform(p)
      if (process.env.NODE_ENV !== 'development') {
        window.addEventListener("contextmenu", (e) => {
          e.preventDefault()
        })
      }
    })()

  }, []);

  return (
    <LayoutContext.Provider value={{platform}}>
      {typeof window !== 'undefined' ? props.children : null}
    </LayoutContext.Provider>
  )
}
