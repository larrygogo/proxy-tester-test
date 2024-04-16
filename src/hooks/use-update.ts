import type { UpdateManifest, UpdateStatus } from "@tauri-apps/api/updater"
import { checkUpdate, onUpdaterEvent } from "@tauri-apps/api/updater"
import { useEffect, useState } from "react"

export type UpdateInfo = {
  manifest: UpdateManifest | undefined
  isAvailable: boolean
  error: string
  status: UpdateStatus | null
}

export const useUpdate = (): UpdateInfo => {
  const [isAvailable, setIsAvailable] = useState(false)
  const [manifest, setManifest] = useState<UpdateManifest>()
  const [status, setStatus] = useState<UpdateStatus | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const setupUpdater = async () => {
      const unlisten = await onUpdaterEvent(({ error, status }) => {
        setStatus(status)

        if (error) {
          setError(error)
        }
      })

      try {
        const { shouldUpdate, manifest } = await checkUpdate()
        setManifest(manifest)
        setIsAvailable(shouldUpdate)
      } catch (error) {
        console.error(error)
      }

      return unlisten
    }

    setupUpdater()
  }, [])

  return { manifest, isAvailable, error, status }
}
