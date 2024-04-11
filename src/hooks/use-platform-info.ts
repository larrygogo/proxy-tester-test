import { useEffect, useState } from "react"

import { getTauriVersion, getVersion } from "@tauri-apps/api/app"
import {
  arch as getArch,
  version as getKernalVersion,
  platform as getPlatform,
} from "@tauri-apps/api/os"
import { appConfigDir } from "@tauri-apps/api/path"

export const usePlatformInfo = () => {
  const [platformInfo, setPlatformInfo] = useState({
    appVersion: "",
    tauriVersion: "",
    os: "",
    kernalVersion: "",
    arch: "",
    configDir: "",
  })

  useEffect(() => {
    const allPromises = [
      getTauriVersion(),
      getVersion(),
      getPlatform(),
      getKernalVersion(),
      getArch(),
      appConfigDir(),
    ]

    // get all the dataz
    Promise.allSettled(allPromises).then((results) => {
      const [
        tauriVersion = "",
        appVersion = "",
        os = "",
        kernalVersion = "",
        arch = "",
        configDir = "",
      ] = results.map((result) => {
        if (result.status === "fulfilled") {
          return result.value
        }
        return ""
      })

      setPlatformInfo({
        tauriVersion,
        appVersion,
        os,
        kernalVersion,
        arch,
        configDir,
      })
    })
  }, [])

  return platformInfo
}
