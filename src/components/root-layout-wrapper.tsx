'use client'
import clsx from "clsx";
import {useEffect, useState} from "react";

const RootLayoutWrapper = (props: {children: React.ReactNode}) => {
  const {children} = props
  const [isActive, setIsActive] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoaded(true)
      import("@tauri-apps/api/window").then(({appWindow}) => {
        appWindow.listen('tauri://focus', () => {
          setIsActive(true)
        })
        appWindow.listen('tauri://blur', () => {
          setIsActive(false)
        })
      })
    }
  }, [])

  return (
    <div
      data-tauri-drag-region="true"
      className={clsx(
        "px-2 pt-8 h-screen",
        isActive ? "bg-blue-950/80" : "bg-gray-700"
      )}>
      {isLoaded ? children : null}
    </div>
  )

}

export default RootLayoutWrapper