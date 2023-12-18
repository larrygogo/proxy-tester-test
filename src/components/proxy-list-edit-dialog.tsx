import {Fragment, useCallback, useContext, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {ProxyTaskContext} from "@/context/ProxyTaskContext";

type Props = {
  onClose?: () => void
  open: boolean
}

const ProxyListEditDialog = (props: Props) => {
  const {onClose, open} = props
  const [proxyText, setProxyText] = useState<string>('')
  const {proxyList, setProxyList} = useContext(ProxyTaskContext)

  const handleSave = useCallback(async () => {
    setProxyList?.(proxyText.split('\n').filter(Boolean))
    onClose?.()
  }, [onClose, proxyText, setProxyList])

  useEffect(() => {
    (async () => {
      setProxyText(proxyList?.join('\n') || '')
    })()
  }, [proxyList]);

  // 快捷键
  useEffect(() => {
    // CmdOrCtrl + S
    import('@tauri-apps/api').then(({globalShortcut}) => {
      globalShortcut.isRegistered('CmdOrCtrl+S').then((registered) => {
        if (!registered && open) {
          return globalShortcut.register('CmdOrCtrl+S', handleSave)
        } else {
          return globalShortcut.unregister('CmdOrCtrl+S')
        }
      })
    })
  }, [open, handleSave])

  return (
    <Transition show={open} as="div" className="absolute">
      <Dialog className="relative z-50 font-mono" onClose={() => onClose?.()}>
        {/*
          Use one Transition.Child to apply one transition to the backdrop...
        */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30"/>
        </Transition.Child>
        <Transition.Child
          as="div"
          className="fixed inset-0 flex items-center justify-center"
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel
            className="flex flex-col gap-4 mx-auto w-4/5 h-4/6 rounded-xl shadow-2xl text-black p-8 bg-white border">
            <Dialog.Description as="div" className="flex flex-1">
              <div className="flex flex-col flex-1">
                <div className="flex-1 relative pb-8 border text-sm rounded-xl overflow-hidden">
                    <textarea
                      placeholder="host:port(:username:password)"
                      className="p-2 w-full h-full resize-none focus:outline-none"
                      value={proxyText} onChange={(e) => setProxyText(e.target.value)}/>
                  <div className="absolute w-full bottom-0 select-none bg-stone-50 text-gray-400 text-xs">
                    <div className="flex items-center justify-between px-2 py-1">
                      <div>
                        Ctrl/Cmd + S: Save
                      </div>
                      <div className="pr-2">
                        line: {proxyText?.split('\n').filter(Boolean).length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Dialog.Description>
            <div className="flex gap-3 justify-end">
              <button
                className="hover:bg-gray-100 border text-black/9 text-sm py-1.5 px-4 rounded-md"
                onClick={() => onClose?.()}>Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-400 text-white text-sm py-1.5 px-4 rounded-md"
                onClick={handleSave}>Save
              </button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}

export default ProxyListEditDialog