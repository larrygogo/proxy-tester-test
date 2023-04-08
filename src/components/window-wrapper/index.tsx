// ** React Imports
import {useState, useEffect, ReactNode} from 'react'

// ** Next Import
import {useRouter} from 'next/router'

interface Props {
  children: ReactNode
}

const WindowWrapper = ({children}: Props) => {
  // ** State
  const [windowReadyFlag, setWindowReadyFlag] = useState<boolean>(false)

  const router = useRouter()

  const handleIsTauri = () => {
    return Boolean(
      typeof window !== 'undefined' &&
      window !== undefined &&
      window.__TAURI_IPC__ !== undefined
    )
  };

  useEffect(
    () => {
      console.log(window)
      if (handleIsTauri()) {
        console.log(window)
        setWindowReadyFlag(true)
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  if (windowReadyFlag) {
    return <>{children}</>
  } else {
    return null
  }
}

export default WindowWrapper
