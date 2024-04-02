import {Minus, Square, X} from "lucide-react";
import {createRef, useEffect} from "react";

export default function WinHeader() {
  const minimizeRef =createRef<HTMLButtonElement>();
  const maximizeRef =createRef<HTMLButtonElement>();
  const closeRef =createRef<HTMLButtonElement>();

  useEffect(() => {
    (async() => {
      const {window} = await import("@tauri-apps/api")
      minimizeRef.current?.addEventListener('click', () => window.appWindow.minimize())
      maximizeRef.current?.addEventListener('click', () => window.appWindow.toggleMaximize())
      closeRef.current?.addEventListener('click', () => window.appWindow.close())
    })()
  }, [closeRef, maximizeRef, minimizeRef]);

  return (
    <div
      data-tauri-drag-region="true"
      className="w-full flex justify-between items-center">
      <div
        data-tauri-drag-region="true"
        className="px-4 pointer-events-none select-none text-center text-zinc-700 font-semibold font-sans text-sm cursor-default"
      >Proxy Tester
      </div>
      <div
        className="justify-end flex items-center pb-1">
        <button title="最小化" ref={minimizeRef} className="py-1 px-2 hover:bg-gray-50">
          <Minus size={16}/>
        </button>
        <button title="最大化" ref={maximizeRef} className="py-1 px-2 hover:bg-gray-50">
          <Square size={14}/>
        </button>
        <button title="关闭" ref={closeRef} className="py-1 px-2 hover:bg-red-600 hover:text-white">
          <X size={16}/>
        </button>
      </div>
    </div>
  )
}