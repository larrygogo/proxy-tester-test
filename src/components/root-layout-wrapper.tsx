'use client'

const RootLayoutWrapper = (props: {children: React.ReactNode}) => {
  const {children} = props

  return (
    <div
      data-tauri-drag-region="true"
      className="px-4 pt-4 h-screen bg-blue-950/80">
      {children}
    </div>
  )

}

export default RootLayoutWrapper