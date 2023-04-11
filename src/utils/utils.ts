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