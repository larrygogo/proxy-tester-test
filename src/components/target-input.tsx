'use client';
import {Listbox, Transition} from "@headlessui/react";
import {useContext, useEffect, useMemo, useRef, useState} from "react";
import {useClickAway} from "ahooks";
import Tooltip from "@/components/tooltip";
import clsx from "clsx";
import {LayoutContext} from "@/context/LayoutContext";
import {window} from "@tauri-apps/api";
import {ProxyTaskContext} from "@/context/ProxyTaskContext";

const protocols = [{
  name: 'HTTP(S)',
  value: 'http'
}, {
  name: 'SOCKS5',
  value: 'socks5'
}]

type Props = {
  onEdit?: () => void
}

export default function TargetInput(props: Props) {
  const ref = useRef(null)
  const {onEdit} = props
  const [open, setOpen] = useState(false)
  const {platform} = useContext(LayoutContext)
  const {
    protocol,
    setProtocol,
    target,
    setTarget,
    startTask
  } = useContext(ProxyTaskContext)

  const editButtonLabel = useMemo(() => {
    if ('darwin' === platform) {
      // Cmd 符号
      return 'Edit Proxy (⌘ + E)'
    }
    return 'Edit Proxy(Ctrl+E)'
  }, [platform])

  const handleStart = async () => {
    startTask?.()
  }

  useClickAway(() => {
    setOpen(false)
  }, ref)

  useEffect(() => {
    (async () => {
      // 监听窗口失去焦点事件
      await window.appWindow.listen('tauri://blur', () => {
        setOpen(false)
      })
    })()
  }, []);

  return (
    <div className="border rounded-lg flex font-mono text-gray-400">
      <Listbox as="div" className="" value={protocol} onChange={(v) => {
        setProtocol?.(v)
        setOpen(false)
      }}>
        <div className="relative">
          <Listbox.Button
            onClick={() => setOpen(true)}
            className="h-12 w-40 text-gray-400 cursor-pointer px-4 py-2.5 border-r border-white/10 rounded-l focus:outline-none">
            <div>
              {protocols.find((p) => p.value === protocol)?.name}
            </div>
            {/*  倒三角 svg */}
            <svg className="absolute right-4 top-4" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round"/>
            </svg>
          </Listbox.Button>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-65 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-65 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Listbox.Options
              ref={ref}
              className="absolute left-0 top-1 rounded-md overflow-hidden bg-white w-40 shadow-2xl border focus:outline-none"
              static>
              {protocols.map((protocol) => (
                <Listbox.Option
                  className="h-12 py-2.5 text-center cursor-pointer hover:bg-gray-100"
                  key={protocol.value} value={protocol.value}>
                  {protocol.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      <input
        value={target}
        className="relative flex-1 h-12 text-black bg-transparent vim-cursor focus:outline-none"
        placeholder="Target URL/IP"
        onChange={(e) => setTarget?.(e.target.value)}/>
      <div className="flex gap-1 items-center pr-2">
        <Tooltip enterDelay placement="bottom" label={editButtonLabel}>
          <button
            onClick={onEdit}
            className="py-1 px-2 rounded-lg text-gray-500 hover:bg-gray-200 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" fillRule="evenodd"
                    d="M20 4H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1ZM4 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H4Zm2 5h2v2H6V7Zm5 0a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-6Zm-3 4H6v2h2v-2Zm2 1a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1Zm-2 3H6v2h2v-2Zm2 1a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1Z"
                    clipRule="evenodd"/>
            </svg>
          </button>
        </Tooltip>
        <Tooltip enterDelay placement="bottom" label="Test Proxy">
          <button
            disabled={!target}
            onClick={handleStart}
            className={clsx(
              "py-1 px-2 rounded-lg focus:outline-none text-blue-600 bg-blue-600/10 hover:bg-blue-600/20 disabled:bg-transparent disabled:text-gray-400 disabled:hover:bg-gray-200",
            )}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="m15 14l2.045-1.533C19.469 10.648 20.542 6.98 20 4c-2.981-.542-6.649.531-8.467 2.955L10 9m5 5l-3.5 2.5l-4-4L10 9m5 5v2.667a4 4 0 0 1-.8 2.4l-.7.933l-1-1M10 9H7.333a4 4 0 0 0-2.4.8L4 10.5l1 1M8.5 18L5 19l1.166-3.5m9.334-6a1 1 0 1 0 0-2a1 1 0 0 0 0 2Z"/>
            </svg>
          </button>
        </Tooltip>
      </div>
    </div>
  )
}