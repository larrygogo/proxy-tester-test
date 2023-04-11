import {NextRouter} from "next/router";

export const isTauri = () => {
  return Boolean(
    typeof window !== 'undefined' &&
    window !== undefined &&
    window.__TAURI_IPC__ !== undefined
  )
};

export const isClient = () => {
  return typeof window !== 'undefined' && window !== undefined
}

/**
 * Check for URL queries as well for matching
 * Current URL & Item Path
 */
export const handleURLQueries = (router: NextRouter, path: string | undefined): boolean => {
  if (Object.keys(router.query).length && path) {
    const arr = Object.keys(router.query)

    return router.asPath.includes(path) && router.asPath.includes(router.query[arr[0]] as string) && path !== '/'
  }

  return false
}