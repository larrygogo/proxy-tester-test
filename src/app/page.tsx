'use client'
import TargetInput from "@/components/target-input";
import {useEffect, useRef, useState} from "react";
import {useScroll} from "ahooks";
import clsx from "clsx";
import ProxyListEditDialog from "@/components/proxy-list-edit-dialog";
import {ProxyDisplayInfo} from "@/types/proxy";
import {v4 as randomUUID} from "uuid";
import {TaskPool} from "@/utils/task";

const taskPool = TaskPool.getInstance({
  concurrency: 20,
})

enum TaskStatus {
  WAITING = 'waiting',
  RUNNING = 'running',
  FINISH = 'stop',
}

export default function Page() {
  const [importOpen, setImportOpen] = useState(false)
  const ref = useRef(null);
  const scroll = useScroll(ref);
  const [target, setTarget] = useState<string>('')
  const [protocol, setProtocol] = useState<string>('http')
  const [proxyList, setProxyList] = useState<string[]>([])
  const [proxyStates, setProxyStates] = useState<ProxyDisplayInfo[]>([])
  const [finishedCount, setFinishedCount] = useState(0)
  const [taskStatus, setTaskStatus] = useState<TaskStatus>(TaskStatus.WAITING)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    import('@tauri-apps/api/globalShortcut').then(async ({register, isRegistered}) => {
      if (!(await isRegistered('CmdOrCtrl+E'))) {
        await register('CmdOrCtrl+E', () => setImportOpen(true))
      }
    })
  }, []);

  const handleListChange = (proxyList: string[]) => {
    setProxyList(proxyList)
    setFinishedCount(0)
    setTaskStatus(TaskStatus.WAITING)
    setImportOpen(false)
  }

  const handleCopy = async () => {
    const text = proxyStates?.filter(p => p.status === 'OK').map(p => p.value).join('\n')
    await navigator.clipboard.writeText(text || '')
    setCopied(true)
  }

  const handleStart = async () => {
    if (taskStatus === TaskStatus.RUNNING) return
    setFinishedCount(0)
    setTaskStatus(TaskStatus.RUNNING)
    taskPool.clear()
    setProxyStates((prev) => prev.map(p => ({...p, status: undefined, speed: undefined})))

    for (let proxy of proxyStates) {

      const task = async () => {
        const invoke  = (await import("@tauri-apps/api/tauri")).invoke
        const result: { status: string, delay: number } = await invoke('test_nike', {
          socks5: protocol === 'socks5',
          proxy: proxy.host + ':' + proxy.port,
          addr: target,
          username: proxy.username,
          password: proxy.password
        })
        setProxyStates((prev) => prev.map(p => p.id === proxy.id ? {
          ...p,
          status: result.status,
          speed: result?.delay
        } : p))
        return result as any
      }
      await taskPool.addTask(task)
    }
    taskPool.on('progress', (({completed, total}) => {
      setFinishedCount(completed)
      if (completed === total) {
        setTaskStatus(TaskStatus.FINISH)
        taskPool.stop()
      }
    }))
    await taskPool.start()
  }

  useEffect(() => {
    const storageValue = localStorage.getItem('proxyList')
    try {
      const value = JSON.parse(storageValue ?? '').filter(Boolean)
      setProxyList(value)
    } catch (e) {
      localStorage.removeItem('proxyList')
    }
  }, []);

  useEffect(() => {
    const list = proxyList?.map((p) => {
      const [host, port, username, password] = p.split(':')
      return {
        id: randomUUID(),
        host,
        port: Number(port),
        username,
        password,
        value: p,
      } as ProxyDisplayInfo
    })

    setProxyStates(list || [])
  }, [proxyList]);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 3000)
    }
  }, [copied]);

  return (

    <div className="h-full flex flex-col gap-4 px-2 text-gray-400 font-mono">
      {/*<div className="flex gap-6 z-50 border-b border-dashed border-gray-600 text-sm" data-tauri-drag-region="true">*/}
      {/*  <ProxyMenu />*/}
      {/*</div>*/}
      <div className="h-full flex flex-col flex-1 bg-white rounded-t-lg overflow-hidden">
        <div className={clsx(
          "py-4 px-4 bg-white",
          scroll?.top! > 0 && "shadow border-b border-gray-200 z-10"
        )}>
          <TargetInput
            target={target}
            onTargetChange={(v) => setTarget(v)}
            protocol={protocol}
            onProtocolChange={(v) => setProtocol(v)}
            onStart={handleStart}
            onEdit={() => setImportOpen(true)}/>
        </div>
        <div ref={ref} className="flex-1 flex flex-col gap-2 px-4 overflow-y-scroll">
          {proxyStates?.length === 0 && (
            <div className="flex flex-col gap-4 flex-1 items-center justify-center w-full">
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"
                   focusable="false" aria-hidden="true">
                <rect width="200" height="200" fill="transparent"></rect>
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M123.171 114.655L122.967 114.478L88.3608 141.586L88.8257 141.544C98.8613 140.631 105.543 141.164 107.62 141.542L107.715 141.559L123.171 114.655Z"
                      fill="#515151"></path>
                <rect x="67.706" y="73.871" width="55.6333" height="39.8004" fill="white" stroke="#515151"></rect>
                <path d="M49.9682 136.507L67.6729 114.062H123.112L105.408 136.507H49.9682Z" fill="#E6E8EA"
                      stroke="#515151"></path>
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M101.667 78.5669H75.749V100.017H94.5175V106.273H109.115V92.5687H101.667V78.5669Z"
                      fill="#C6CACD"></path>
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M76.6583 79.427H100.924V92.5689H94.5173V99.2238H76.6583V79.427ZM94.5173 100.05H75.7402V78.6006H101.75V92.5689H109.115V106.273H94.5173V100.05ZM101.75 93.3953H108.288V105.446H95.3437V100.05H101.75V93.3953ZM100.924 93.3953V99.2238H95.3437V93.3953H100.924Z"
                      fill="white"></path>
                <path
                  d="M43.2894 174.887H33.5098C37.6971 173.674 37.5502 162.903 36.9533 157.669C37.8348 163.399 41.5447 171.535 43.2894 174.887Z"
                  fill="#515151" stroke="black"></path>
                <path
                  d="M75.9344 40.589C75.9344 58.6942 61.2572 73.3714 43.152 73.3714C25.0468 73.3714 10.3696 58.6942 10.3696 40.589C10.3696 22.4838 25.0468 7.80664 43.152 7.80664C61.2572 7.80664 75.9344 22.4838 75.9344 40.589Z"
                  fill="#e0e7ff"></path>
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M47.56 25.1162C47.56 22.6819 45.5866 20.7085 43.1523 20.7085C40.718 20.7085 38.7446 22.6819 38.7446 25.1162V36.1811H27.6797C25.2454 36.1811 23.272 38.1545 23.272 40.5888C23.272 43.0231 25.2454 44.9965 27.6797 44.9965H38.7446V56.0614C38.7446 58.4957 40.718 60.4691 43.1523 60.4691C45.5866 60.4691 47.56 58.4957 47.56 56.0614V44.9965H58.6249C61.0592 44.9965 63.0326 43.0231 63.0326 40.5888C63.0326 38.1545 61.0592 36.1811 58.6249 36.1811H47.56V25.1162Z"
                      fill="#a5b4fc"></path>
                <path d="M63.8232 83.3276C59.299 81.4946 50.2893 75.371 50.444 65.5405" stroke="#515151"></path>
                <path
                  d="M52.5875 110.23C55.4741 110.324 59.095 111.144 62.5611 115.113C65.043 117.955 67.2268 122.321 70.0129 129.61C70.8414 122.952 73.0863 116.354 74.2836 113.287C75.4809 110.221 79.5694 103.037 83.6286 102.774C87.6879 102.512 88.0967 106.337 86.1985 107.418C84.3003 108.498 83.1906 108.381 81.4092 110.834C79.6278 113.287 78.4516 115.776 79.3907 122.165C80.1164 119.227 81.1561 117.583 82.1661 116.46C83.1761 115.338 90.9642 108.403 96.5303 108.111C100.387 107.909 101.722 108.817 101.313 109.841C102.762 109.449 104.18 109.279 105.389 109.515C107.473 109.923 108.165 111.412 107.216 112.695C109.406 112.53 111.496 112.92 112.578 114.53C112.906 115.019 112.82 116.168 112.021 117.115C111.247 118.034 109.774 118.755 109.189 119.064C107.999 119.692 103.255 122.779 101.841 127.169C100.427 131.558 99.1098 134.63 105.304 147.994C110.01 158.147 110.937 169.316 107.168 177.598C116.131 177.316 124.055 175.447 129.189 172.551C133.58 170.074 137.464 167.054 139.578 162.043C137.251 142.389 137.314 104.786 140.493 104.621C144.985 104.388 142.222 152.627 140.493 159.322C140.243 160.291 139.936 161.195 139.578 162.043C140.249 167.71 141.119 171.885 142.17 173.24C143.868 175.428 182.608 177.997 192.377 174.829C193.654 174.415 194.436 173.903 194.575 173.279C195.587 168.736 179.782 165.016 173.696 159.322C169.51 155.405 170.929 126.896 168.734 108.865C166.538 90.8332 160.821 72.3923 143.471 68.1568C129.848 64.8309 118.485 69.8923 113.325 73.7972H85.6167C88.3315 68.2027 96.0759 57.7429 112.021 54.6164C131.282 50.8399 148.198 59.8092 158.976 72.0829C163.931 77.3247 166.725 80.7918 168.206 80.7918C169.687 80.7918 177.431 76.1108 185.814 75.567C188.309 75.413 188.266 78.2111 186.996 82.3737C186.477 84.0771 185.906 85.4371 184.914 87.4391C182.467 92.3785 177.075 101.741 168.734 108.865C170.929 126.896 169.51 155.405 173.696 159.322C179.782 165.016 195.587 168.736 194.575 173.279C194.436 173.903 193.654 174.415 192.377 174.829C182.608 177.997 143.868 175.428 142.17 173.24C141.119 171.885 140.249 167.71 139.578 162.043C137.464 167.054 133.58 170.074 129.189 172.551C124.055 175.447 116.131 177.316 107.168 177.598C105.977 180.217 104.316 182.547 102.156 184.465C93.1654 192.449 73.1717 196.139 54.3858 186.142C44.8247 181.054 39.6677 168.523 36.8881 155.972L36.8932 156.026C37.7389 164.953 38.2316 170.155 34.7066 174.548C27.6355 175.167 21.319 174.548 15.1313 172.633C9.90792 171.016 2.21849 164.317 6.75439 150.018C11.2903 135.718 34.7324 117.24 36.8881 115.806C39.0438 114.373 44.8455 110.23 52.5875 110.23Z"
                  fill="white"></path>
                <path
                  d="M70.0129 129.61C68.2344 140.315 70.1452 157.678 73.3401 156.899C74.3429 156.654 74.9144 155.317 75.0122 153.003C82.1661 153.336 102.782 160.986 109.48 164.796C109.634 169.418 108.892 173.81 107.168 177.598C105.977 180.217 104.316 182.547 102.156 184.465C93.1654 192.449 73.1717 196.139 54.3858 186.142C44.8247 181.054 39.6677 168.523 36.8881 155.972L36.8932 156.026C37.7389 164.953 38.2316 170.155 34.7066 174.548C27.6355 175.167 21.319 174.548 15.1313 172.633C9.90792 171.016 2.21849 164.317 6.75439 150.018C11.2903 135.718 34.7324 117.24 36.8881 115.806C39.0438 114.373 44.8455 110.229 52.5875 110.229C55.4741 110.324 59.095 111.144 62.5611 115.113C65.043 117.955 67.2268 122.321 70.0129 129.61Z"
                  fill="#E6E8EA"></path>
                <path
                  d="M70.0129 129.61C75.5169 146.124 76.2725 156.184 73.3401 156.899C70.1452 157.678 68.2344 140.315 70.0129 129.61ZM70.0129 129.61C67.2268 122.321 65.043 117.955 62.5611 115.113C59.095 111.144 55.4741 110.324 52.5875 110.23C44.8455 110.23 39.0438 114.373 36.8881 115.806C34.7324 117.24 11.2903 135.718 6.75439 150.018C2.21849 164.317 9.90792 171.016 15.1313 172.633C21.319 174.548 27.6355 175.167 34.7066 174.548C38.2386 170.146 37.7369 164.932 36.8881 155.972M70.0129 129.61C70.8414 122.952 73.0863 116.354 74.2836 113.287C75.4809 110.221 79.5694 103.037 83.6286 102.774C87.6879 102.512 88.0967 106.337 86.1985 107.418C84.3003 108.498 83.1906 108.381 81.4092 110.834C79.6278 113.287 78.4516 115.776 79.3907 122.165C80.1164 119.227 81.1561 117.583 82.1661 116.46C83.1761 115.338 90.9642 108.403 96.5303 108.111C102.096 107.82 102.411 109.839 99.8072 111.186C97.2037 112.533 92.1938 113.79 85.4654 123.351C85.4654 123.351 84.8687 118.107 95.4755 112.308C98.3462 110.739 102.474 108.946 105.389 109.515C108.535 110.13 108.51 113.21 104.453 114.324C103.242 114.656 101.081 115.791 99.364 117.24C96.5097 119.647 94.1005 122.809 93.582 123.776C94.0084 120.252 97.8901 115.264 102.542 113.702C105.752 112.625 110.693 111.725 112.578 114.53C112.906 115.019 112.82 116.168 112.021 117.115C111.247 118.034 109.774 118.755 109.189 119.064C107.999 119.692 103.255 122.779 101.841 127.169C100.427 131.558 99.1098 134.63 105.304 147.994C110.01 158.147 110.937 169.316 107.168 177.598M33.6622 126.262C33.7378 131.737 34.2063 143.863 36.8881 155.972M36.8881 155.972C39.6677 168.523 44.8247 181.054 54.3858 186.142C73.1717 196.139 93.1654 192.449 102.156 184.465C104.316 182.547 105.977 180.217 107.168 177.598M107.168 177.598C116.131 177.316 124.055 175.447 129.189 172.551C134.323 169.655 138.764 166.017 140.493 159.322C142.222 152.627 144.985 104.388 140.493 104.621C136.398 104.834 137.474 167.185 142.17 173.24C143.868 175.428 182.608 177.997 192.377 174.829M168.734 108.865C170.929 126.896 169.51 155.405 173.696 159.322C179.782 165.016 195.587 168.736 194.575 173.279C194.436 173.903 193.654 174.415 192.377 174.829M168.734 108.865C166.539 90.8332 160.821 72.3923 143.471 68.1568C129.848 64.8309 118.485 69.8923 113.325 73.7972H85.6167C88.3315 68.2027 96.0759 57.7429 112.021 54.6164C131.282 50.8399 148.198 59.8092 158.976 72.0829C163.931 77.3247 166.725 80.7918 168.206 80.7918C169.687 80.7918 177.431 76.1108 185.814 75.567C188.309 75.413 188.266 78.2111 186.996 82.3737M168.734 108.865C177.075 101.741 182.467 92.3785 184.914 87.4391C185.906 85.4371 186.477 84.0771 186.996 82.3737M192.377 174.829C191.954 171.914 191.129 171.268 187.574 170.227M186.996 82.3737C187.011 81.3629 187.149 80.3006 186.566 79.6339C184.797 77.6114 180.682 77.5637 180.111 81.6122"
                  stroke="#515151"></path>
                <path
                  d="M58.1244 104.222C58.1244 110.068 53.4484 114.796 47.694 114.796C41.9396 114.796 37.2637 110.068 37.2637 104.222C37.2637 98.3755 41.9396 93.6475 47.694 93.6475C53.4484 93.6475 58.1244 98.3755 58.1244 104.222Z"
                  fill="white" stroke="#515151"></path>
                <mask id="path-16-inside-1" fill="white">
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M49.0146 93.7897C55.1924 94.3756 53.5744 106.093 49.6029 111.367C46.7226 115.191 48.4316 118.499 50.5099 122.521C50.9335 123.341 51.3724 124.191 51.7909 125.08C53.7504 127.949 54.885 131.351 54.885 134.999C54.885 145.246 45.9347 153.552 34.8939 153.552C23.8531 153.552 14.9028 145.246 14.9028 134.999C14.9028 127.111 20.2072 120.373 27.6863 117.689C34.9897 113.65 37.2698 109.614 37.5416 102.578C37.7769 96.4849 42.8368 93.2038 49.0146 93.7897Z"></path>
                </mask>
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M49.0146 93.7897C55.1924 94.3756 53.5744 106.093 49.6029 111.367C46.7226 115.191 48.4316 118.499 50.5099 122.521C50.9335 123.341 51.3724 124.191 51.7909 125.08C53.7504 127.949 54.885 131.351 54.885 134.999C54.885 145.246 45.9347 153.552 34.8939 153.552C23.8531 153.552 14.9028 145.246 14.9028 134.999C14.9028 127.111 20.2072 120.373 27.6863 117.689C34.9897 113.65 37.2698 109.614 37.5416 102.578C37.7769 96.4849 42.8368 93.2038 49.0146 93.7897Z"
                      fill="#515151"></path>
                <path
                  d="M49.6029 111.367L51.9993 113.171V113.171L49.6029 111.367ZM49.0146 93.7897L48.7313 96.7763L48.7313 96.7763L49.0146 93.7897ZM50.5099 122.521L53.1752 121.144V121.144L50.5099 122.521ZM51.7909 125.08L49.0764 126.357L49.1784 126.574L49.3136 126.772L51.7909 125.08ZM27.6863 117.689L28.6996 120.513L28.9268 120.431L29.138 120.314L27.6863 117.689ZM37.5416 102.578L34.5438 102.462L37.5416 102.578ZM51.9993 113.171C54.4038 109.979 55.9656 105.116 56.1129 100.926C56.1868 98.8228 55.9187 96.5591 54.9346 94.6609C53.8722 92.6119 51.9836 91.0578 49.2978 90.8031L48.7313 96.7763C49.1344 96.8145 49.3603 96.9449 49.608 97.4226C49.9338 98.051 50.1714 99.1562 50.1166 100.715C50.0065 103.848 48.7735 107.481 47.2066 109.562L51.9993 113.171ZM53.1752 121.144C52.0769 119.018 51.3798 117.611 51.149 116.336C50.9676 115.333 51.0733 114.401 51.9993 113.171L47.2066 109.562C45.2522 112.157 44.7723 114.791 45.2448 117.404C45.6681 119.744 46.8646 122.001 47.8446 123.898L53.1752 121.144ZM54.5055 123.803C54.0596 122.855 53.5952 121.957 53.1752 121.144L47.8446 123.898C48.2717 124.725 48.6853 125.526 49.0764 126.357L54.5055 123.803ZM49.3136 126.772C50.9511 129.17 51.885 131.987 51.885 134.999H57.885C57.885 130.715 56.5497 126.728 54.2683 123.388L49.3136 126.772ZM51.885 134.999C51.885 143.382 44.4927 150.552 34.8939 150.552V156.552C47.3766 156.552 57.885 147.11 57.885 134.999H51.885ZM34.8939 150.552C25.2951 150.552 17.9028 143.382 17.9028 134.999H11.9028C11.9028 147.11 22.4111 156.552 34.8939 156.552V150.552ZM17.9028 134.999C17.9028 128.529 22.2629 122.822 28.6996 120.513L26.673 114.865C18.1516 117.923 11.9028 125.693 11.9028 134.999H17.9028ZM34.5438 102.462C34.4194 105.684 33.8475 107.868 32.7169 109.652C31.5726 111.457 29.6524 113.174 26.2346 115.064L29.138 120.314C33.0235 118.166 35.8951 115.845 37.7847 112.864C39.6879 109.861 40.392 106.509 40.5393 102.694L34.5438 102.462ZM49.2978 90.8031C45.6324 90.4555 42.0532 91.2323 39.2808 93.2562C36.446 95.3257 34.6955 98.5337 34.5438 102.462L40.5393 102.694C40.6229 100.529 41.5201 99.0502 42.8185 98.1023C44.1794 97.1088 46.219 96.538 48.7313 96.7763L49.2978 90.8031Z"
                  fill="#515151" mask="url(#path-16-inside-1)"></path>
                <path
                  d="M54.0973 105.948C54.0973 107.639 52.6657 109.043 50.858 109.043C49.0503 109.043 47.6187 107.639 47.6187 105.948C47.6187 104.256 49.0503 102.852 50.858 102.852C52.6657 102.852 54.0973 104.256 54.0973 105.948Z"
                  fill="white" stroke="#515151"></path>
                <path
                  d="M37.1187 95.0657C37.1187 96.8972 35.5779 98.4556 33.585 98.4556C31.5921 98.4556 30.0513 96.8972 30.0513 95.0657C30.0513 93.2342 31.5921 91.6758 33.585 91.6758C35.5779 91.6758 37.1187 93.2342 37.1187 95.0657Z"
                  fill="#515151" stroke="#515151" strokeWidth="3"></path>
                <path d="M147.224 155.647C147.116 159.23 148.491 160.533 151.929 161.727" stroke="#515151"></path>
              </svg>
              <button
                onClick={() => setImportOpen(true)}
                className="flex gap-2 items-center py-1 px-4 rounded-md bg-indigo-100 text-indigo-500 hover:bg-indigo-200 focus:outline-none">
                Edit Proxy
              </button>
            </div>
          )}
          {proxyStates?.map((_) => (
            <div key={_.id} className={clsx(
              "flex gap-4 justify-between text-sm border py-1.5 px-4 rounded-lg bg-gray-50",
              _.status === 'TIMEOUT' && 'bg-red-50 border-red-100',
            )}>
              <div className="truncate" title={_.value}>
                {_.value}
              </div>
              <div className={clsx(
                "w-1/5 text-right",
                _.status === 'TIMEOUT' && 'text-red-400',
              )}>
                {_.speed !== undefined && _.speed !== null && `${_.speed}ms`}
                {_.speed !== undefined && _.speed === null && _.status}
              </div>
            </div>
          ))}
        </div>
        <div className="">
          <div className="flex justify-between items-center px-4 py-2 bg-stone-100 border-t text-xs text-gray-600 ">
            <div className="flex items-center divide-x">
              <div className="pr-2">
                lines {proxyList?.length}
              </div>
              <div className="flex gap-2 items-center px-2">
                <span className="relative flex gap-1 h-2 w-2">
                  {taskStatus === TaskStatus.RUNNING && <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>}
                  <span className={clsx(
                    "relative inline-flex rounded-full h-2 w-2",
                    taskStatus === TaskStatus.RUNNING ? 'bg-green-500' : 'bg-gray-300',
                  )}></span>
                </span>
                <div>
                  progress {finishedCount} / {proxyList?.length}
                </div>
                {taskStatus === TaskStatus.FINISH && (
                  <div className="py-1 px-2 bg-green-100 text-green-700 rounded">
                    usable {proxyStates.filter(item => item.speed !== null).length}
                  </div>
                )}
              </div>

            </div>
            <div className="flex gap-1">
              {/*<button*/}
              {/*  className="flex gap-2 items-center py-1 px-2 rounded-md hover:bg-gray-200 hover:text-gray-800 focus:outline-none"*/}
              {/*  type="button">*/}
              {/*  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">*/}
              {/*    <g fill="none">*/}
              {/*      <path*/}
              {/*        d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/>*/}
              {/*      <path fill="currentColor"*/}
              {/*            d="M19 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2h10Zm-4 6H5v12h10V8Zm-5 7a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h2Zm9-11H9v2h6a2 2 0 0 1 2 2v8h2V4Zm-7 7a1 1 0 0 1 .117 1.993L12 13H8a1 1 0 0 1-.117-1.993L8 11h4Z"/>*/}
              {/*    </g>*/}
              {/*  </svg>*/}
              {/*  <span>*/}
              {/*    Download Usable*/}
              {/*  </span>*/}
              {/*</button>*/}
              <button
                disabled={copied}
                onClick={handleCopy}
                className={clsx(
                  "flex gap-2 items-center py-1 px-2 rounded-md focus:outline-none",
                  copied && 'bg-green-100 text-green-700',
                  !copied && 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800',
                )}
                type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                  <g fill="none">
                    <path
                      d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/>
                    <path fill="currentColor"
                          d="M19 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2h10Zm-4 6H5v12h10V8Zm-5 7a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h2Zm9-11H9v2h6a2 2 0 0 1 2 2v8h2V4Zm-7 7a1 1 0 0 1 .117 1.993L12 13H8a1 1 0 0 1-.117-1.993L8 11h4Z"/>
                  </g>
                </svg>
                <span>
                  {copied ? 'Copied Success' : 'Copy Usable'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <ProxyListEditDialog open={importOpen} onSave={handleListChange} onClose={() => setImportOpen(false)}/>
    </div>
  )
}