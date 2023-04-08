import {Alert, alpha, Box, Button, Container, IconButton, LinearProgress, useTheme} from "@mui/material";
import TargetInput from "@/components/TargetInput";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useEffect, useRef, useState} from "react";
import ProxyVirtualizedTable from "@/components/ProxyVirtualizedTable";
import Icon from "@/components/icon";
import {ProxyDisplayInfo, ProxyInfo} from "@/types/proxy";
import {TaskPool} from "@/utils/task";
import {invoke} from "@tauri-apps/api/tauri";
import defaultData from "@/data/proxy";
import dynamic from "next/dynamic";
import ImportDialog from "@/components/ImportDialog";
import SettingsDialog from "@/components/SettingsDialog";

const ImportButton = dynamic(() => import('@/components/ImportButton'), {ssr: false})
const taskPool = TaskPool.getInstance({
  concurrency: 10,
})

export default function Home() {
  const theme = useTheme()
  const formRef = useRef<HTMLFormElement>(null)
  const [started, setStarted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [concurrency, setConcurrency] = useState(10)
  const [socks5, setSocks5] = useState(false)
  const [proxyData, setProxyData] = useState<ProxyDisplayInfo[]>(defaultData as ProxyDisplayInfo[])
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  const schema = yup.object().shape({
    target: yup.string().matches(/^(http(s)?:\/\/|socks5:\/\/|)(([a-zA-Z0-9-]+\.)+[a-zA-Z]+)(:\d+)?(\/\S*)?$/, 'Invalid target')
  })

  const {control, handleSubmit, formState: {errors}} = useForm({
    defaultValues: {
      target: 'http://www.google.com'
    },
    resolver: yupResolver(schema),
    delayError: 1
  })

  const handleStart = async (data: any) => {
    setProgress(0)
    setStarted(true)
    taskPool.clear()
    setProxyData((prev) => prev.map(p => ({...p, status: undefined, speed: ''})))
    proxyData.forEach((proxy) => {

      const task = async () => {
        const result: string = await invoke('test_proxy', {
          socks5,
          proxy: proxy.host + ':' + proxy.port,
          addr: data.target,
          username: proxy.username,
          password: proxy.password
        })
        setProxyData((prev) => prev.map(p => p.id === proxy.id ? {
          ...p,
          status: result,
          speed: result
        } : p))
        return result as any
      }
      taskPool.addTask(task)
    })
    await taskPool.on('progress', (({completed, total}) => {
      console.log(completed / total * 100, completed, total)
      setProgress(completed / total * 100)
      if (completed === total) {
        setStarted(false)
      }
    }))
    await taskPool.start()
  }

  const handleStop = async () => {
    await taskPool.stop()
    setStarted(false)
  }

  const onSubmit = handleSubmit(async (data) => {
    if (started) {
      await handleStop()
    } else {
      await handleStart(data)
    }
  })

  useEffect(() => {
    if (concurrency >= 1) {
      const taskPool = TaskPool.getInstance()
      taskPool.setConcurrency(concurrency)
    }
  }, [concurrency])


  return (
    <Box>
      <Container>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}>
          <svg width="219" height="26" viewBox="0 0 219 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.3047 12.832L9.01562 12.7617L8.76953 17.8945C5.29297 18.0352 3.10547 18.1055 2.20703 18.1055C1.30859 18.1055 0.800781 18.0898 0.683594 18.0586C0.707031 17.7773 0.726562 17.3594 0.742188 16.8047L0.777344 14.8359C0.816406 13.7422 0.925781 9.17969 1.10547 1.14844C5.17578 0.914062 9.33984 0.796875 13.5977 0.796875C16.5586 0.796875 18.8359 1.21094 20.4297 2.03906C22.4922 3.11719 23.5195 4.76953 23.5117 6.99609C23.5117 10.8867 20.1094 12.832 13.3047 12.832ZM15.1445 6.91406C15.1445 6.1875 14.8906 5.75 14.3828 5.60156C13.8828 5.45312 13.1914 5.37891 12.3086 5.37891C11.4336 5.37891 10.4375 5.4375 9.32031 5.55469C9.21094 6.78125 9.15625 7.84766 9.15625 8.75391C9.28125 8.80078 10.1016 8.82422 11.6172 8.82422C13.9688 8.82422 15.1445 8.1875 15.1445 6.91406ZM27.4023 18.1055L26.2422 18.1289C26.1953 17.7695 26.1719 17.5078 26.1719 17.3438C26.1719 17.3438 26.3164 13.8164 26.6055 6.76172L29.8516 6.07031L31.2109 8.42578C32.6953 6.51172 34.1836 5.55469 35.6758 5.55469C36.293 5.55469 36.9297 5.67969 37.5859 5.92969C38.25 6.17969 38.6875 6.44531 38.8984 6.72656L37.668 10.125C36.8008 9.76562 35.9531 9.58594 35.125 9.58594C34.2969 9.58594 33.6172 9.82031 33.0859 10.2891C33.0547 10.3203 33.0234 10.3438 32.9922 10.3594L32.9688 10.3945L32.4766 17.8594L27.4023 18.1055ZM49.8906 15.2344C50.8203 15.2344 51.5234 14.9258 52 14.3086C52.4844 13.6914 52.7266 12.918 52.7266 11.9883C52.7266 11.0586 52.4688 10.3203 51.9531 9.77344C51.4453 9.21875 50.7422 8.94141 49.8438 8.94141C48.9453 8.94141 48.2656 9.26172 47.8047 9.90234C47.3516 10.5352 47.125 11.2812 47.125 12.1406C47.125 14.2031 48.0469 15.2344 49.8906 15.2344ZM40.6328 12.2344C40.6328 7.71875 43.9219 5.46094 50.5 5.46094C52.9531 5.46094 54.9844 6.01562 56.5938 7.125C57.375 7.65625 57.9805 8.32422 58.4102 9.12891C58.8477 9.93359 59.0664 10.7852 59.0664 11.6836C59.0664 14.0352 58.2734 15.75 56.6875 16.8281C55.1094 17.8984 52.7812 18.4336 49.7031 18.4336C43.6562 18.4336 40.6328 16.3672 40.6328 12.2344ZM80.8047 18.0117L73.8906 18.1641C73.4922 18.1641 73.0078 18.1836 72.4375 18.2227C72.2812 18.1055 72 17.8086 71.5938 17.332C71.1953 16.8555 70.8086 16.3594 70.4336 15.8438C70.2461 16.0547 69.7227 16.6289 68.8633 17.5664L68.4766 17.9883C68.125 18.0117 67.8164 18.0234 67.5508 18.0234C67.5508 18.0234 65.4531 17.9453 61.2578 17.7891C61.2969 17.75 61.4297 17.6094 61.6562 17.3672C61.8906 17.1172 62.0859 16.9219 62.2422 16.7812L67.1523 12.3984C64.4336 9.63281 62.3945 7.67969 61.0352 6.53906L69.707 5.76562L70.0938 6.33984C70.8438 7.37109 71.3125 8.02734 71.5 8.30859L72.9648 6.67969L73.4336 6.08203C73.7617 6.07422 74.2734 6.07031 74.9688 6.07031L80.3594 6.1875C79.2891 6.97656 78.1328 7.99219 76.8906 9.23438C75.6484 10.4688 74.8672 11.2344 74.5469 11.5312L80.8047 18.0117ZM89.6055 19.6875L88.6211 17.918C87.9648 16.7383 86.8516 14.582 85.2812 11.4492C83.7109 8.31641 82.832 6.59375 82.6445 6.28125L89.4883 5.98828L92.7812 13.6172C92.9297 13.2188 93.3398 11.9805 94.0117 9.90234C94.6914 7.82422 95.1367 6.52344 95.3477 6C95.6289 5.97656 95.8906 5.96484 96.1328 5.96484C96.1328 5.96484 97.8945 6.03125 101.418 6.16406C100.598 8.13281 99.4297 10.8516 97.9141 14.3203C96.3906 17.8047 95.5156 19.7656 95.2891 20.2031C94.7031 21.3438 94.0273 22.3203 93.2617 23.1328C91.6055 24.8984 89.3281 25.7812 86.4297 25.7812L84.4023 22.5C84.8711 22.5 85.5664 22.3203 86.4883 21.9609C88.2617 21.2578 89.3008 20.5 89.6055 19.6875ZM122.629 17.9531C122.629 17.9531 119.957 18.0273 114.613 18.1758L114.859 10.1602C114.922 8.22266 114.98 6.73047 115.035 5.68359H108.637C108.652 5.35547 108.711 4.65625 108.812 3.58594C108.914 2.51562 109.008 1.70703 109.094 1.16016C116.336 1.06641 121.367 1.01953 124.188 1.01953C127.016 1.01953 128.949 1.03125 129.988 1.05469C129.746 3.13281 129.469 4.67578 129.156 5.68359H123.051L122.98 8.21484C122.738 13.8945 122.617 16.9375 122.617 17.3438C122.617 17.7422 122.621 17.9453 122.629 17.9531ZM141.859 10.6641C141.852 9.92969 141.68 9.41016 141.344 9.10547C141.016 8.80078 140.531 8.64844 139.891 8.64844C139.258 8.64844 138.746 8.83984 138.355 9.22266C137.965 9.59766 137.723 10.0703 137.629 10.6406L141.859 10.6641ZM146.453 17.0391C145.969 17.4062 145.105 17.7266 143.863 18C142.621 18.2812 141.414 18.4219 140.242 18.4219C139.078 18.4219 138.09 18.3672 137.277 18.2578C136.465 18.1484 135.66 17.9531 134.863 17.6719C134.066 17.3828 133.383 17.0195 132.812 16.582C132.25 16.1367 131.793 15.5625 131.441 14.8594C131.09 14.1484 130.914 13.3008 130.914 12.3164C130.914 11.3242 131.094 10.4141 131.453 9.58594C131.812 8.75781 132.277 8.08984 132.848 7.58203C134.434 6.16797 136.73 5.46094 139.738 5.46094C141.168 5.46094 142.527 5.73438 143.816 6.28125C145.105 6.84375 146.023 7.6875 146.57 8.8125C146.883 9.44531 147.039 10.1445 147.039 10.9102L146.898 12.8438L137.395 12.7969C137.582 13.5078 138.035 14.0664 138.754 14.4727C139.48 14.8789 140.469 15.082 141.719 15.082C142.969 15.082 144.41 14.7422 146.043 14.0625H146.676L146.453 17.0391ZM151 14.0859C153.461 14.6016 155.484 14.8594 157.07 14.8594C158.656 14.8594 159.449 14.7422 159.449 14.5078C159.449 14.2656 159.273 14.0898 158.922 13.9805C158.578 13.8633 157.621 13.6719 156.051 13.4062C154.488 13.1406 153.387 12.8828 152.746 12.6328C151.059 11.9922 150.215 11.0273 150.215 9.73828C150.223 8.60547 150.656 7.72656 151.516 7.10156C153.008 6.00781 155.43 5.46094 158.781 5.46094C160.789 5.46094 162.77 5.70703 164.723 6.19922L164.16 9.48047C163.629 9.34766 162.723 9.21484 161.441 9.08203C160.168 8.94922 159.043 8.88281 158.066 8.88281C157.098 8.88281 156.613 9.01562 156.613 9.28125C156.613 9.45312 156.711 9.57422 156.906 9.64453C157.109 9.71484 157.781 9.82422 158.922 9.97266C160.062 10.1211 160.879 10.2461 161.371 10.3477C163.223 10.7227 164.465 11.3555 165.098 12.2461C165.504 12.8086 165.707 13.4258 165.707 14.0977C165.707 14.7617 165.637 15.293 165.496 15.6914C165.176 16.5898 164.395 17.2734 163.152 17.7422C161.918 18.2031 160.039 18.4336 157.516 18.4336C156.195 18.4336 154.824 18.3438 153.402 18.1641C151.98 17.9922 150.922 17.7148 150.227 17.332L151 14.0859ZM183.473 17.4844C182.715 17.7812 181.773 18.0117 180.648 18.1758C179.531 18.3398 178.48 18.4219 177.496 18.4219C176.52 18.4219 175.598 18.3086 174.73 18.082C171.973 17.3789 170.594 15.7148 170.594 13.0898C170.594 13.043 170.594 13 170.594 12.9609V12.8203C170.617 12.5938 170.641 11.9688 170.664 10.9453C170.688 9.91406 170.707 9.34766 170.723 9.24609H169.527C168.848 9.24609 168.387 9.21094 168.145 9.14062L168.871 6.45703H171.004C171.113 5.63672 171.195 4.71094 171.25 3.67969C171.312 2.64844 171.359 2 171.391 1.73438C174.273 1.46875 176.555 1.33594 178.234 1.33594C178.281 1.33594 178.328 1.33594 178.375 1.33594C178.383 1.46094 178.387 1.58594 178.387 1.71094L178.164 6.49219H182.723C183.09 6.49219 183.434 6.53906 183.754 6.63281L183.133 9.12891C182.891 9.20703 182.469 9.24609 181.867 9.24609H177.941L177.824 12.6562C177.824 13.4062 178.008 13.9297 178.375 14.2266C178.75 14.5234 179.293 14.6719 180.004 14.6719C180.723 14.6719 181.738 14.4844 183.051 14.1094C183.309 14.0312 183.457 13.9883 183.496 13.9805C183.52 14.207 183.531 14.7461 183.531 15.5977C183.531 16.4492 183.512 17.0781 183.473 17.4844ZM197.383 10.6641C197.375 9.92969 197.203 9.41016 196.867 9.10547C196.539 8.80078 196.055 8.64844 195.414 8.64844C194.781 8.64844 194.27 8.83984 193.879 9.22266C193.488 9.59766 193.246 10.0703 193.152 10.6406L197.383 10.6641ZM201.977 17.0391C201.492 17.4062 200.629 17.7266 199.387 18C198.145 18.2812 196.938 18.4219 195.766 18.4219C194.602 18.4219 193.613 18.3672 192.801 18.2578C191.988 18.1484 191.184 17.9531 190.387 17.6719C189.59 17.3828 188.906 17.0195 188.336 16.582C187.773 16.1367 187.316 15.5625 186.965 14.8594C186.613 14.1484 186.438 13.3008 186.438 12.3164C186.438 11.3242 186.617 10.4141 186.977 9.58594C187.336 8.75781 187.801 8.08984 188.371 7.58203C189.957 6.16797 192.254 5.46094 195.262 5.46094C196.691 5.46094 198.051 5.73438 199.34 6.28125C200.629 6.84375 201.547 7.6875 202.094 8.8125C202.406 9.44531 202.562 10.1445 202.562 10.9102L202.422 12.8438L192.918 12.7969C193.105 13.5078 193.559 14.0664 194.277 14.4727C195.004 14.8789 195.992 15.082 197.242 15.082C198.492 15.082 199.934 14.7422 201.566 14.0625H202.199L201.977 17.0391ZM207.191 18.1055L206.031 18.1289C205.984 17.7695 205.961 17.5078 205.961 17.3438C205.961 17.3438 206.105 13.8164 206.395 6.76172L209.641 6.07031L211 8.42578C212.484 6.51172 213.973 5.55469 215.465 5.55469C216.082 5.55469 216.719 5.67969 217.375 5.92969C218.039 6.17969 218.477 6.44531 218.688 6.72656L217.457 10.125C216.59 9.76562 215.742 9.58594 214.914 9.58594C214.086 9.58594 213.406 9.82031 212.875 10.2891C212.844 10.3203 212.812 10.3438 212.781 10.3594L212.758 10.3945L212.266 17.8594L207.191 18.1055Z"
              fill="black"/>
          </svg>
        </Box>

        <Box component="form" ref={formRef} onSubmit={onSubmit}>
          <Controller
            control={control}
            name="target"
            render={({field}) =>

              <TargetInput
                disabled={started}
                {...field}
                fullWidth
                placeholder="www.google.com"
                aria-invalid={errors.target ? "true" : "false"}
                sx={{
                  ...(started && {
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,.2)'
                  }),
                  background: `linear-gradient(90deg, ${alpha(theme.palette.success.light, 0.5)} ${progress}%, ${theme.palette.background.paper} ${progress}%)`,
                }}
                endAdornment={
                  <Box
                    sx={{
                      position: 'absolute',
                      right: '10px',
                      top: 0,
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <IconButton type="submit">
                      <Icon icon="icon-park-outline:pause-one" color={theme.palette.error.main} fontSize={16}
                            style={{display: started ? 'block' : 'none'}}/>
                      <Icon icon="icon-park-outline:play" color={theme.palette.text.secondary} fontSize={16}
                            style={{display: started ? 'none' : 'block'}}/>
                    </IconButton>
                  </Box>
                }
              />
            }
          />
        </Box>
        {/* 错误提示框 */}
        {errors.target?.message && (
          <Alert
            sx={(theme) => ({
              mt: 1,
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.main,
            })}
            severity="error"
            variant="filled"
          >
            {errors.target?.message}
          </Alert>
        )}
        <ProxyVirtualizedTable data={proxyData}/>
        <Box sx={{display: 'flex', gap: 2, mt: 1}}>
          <Button disabled={started} onClick={() => setImportDialogOpen(true)}>Import Proxies</Button>
          <Button disabled={started} onClick={() => setSettingsDialogOpen(true)}>Settings</Button>
        </Box>
        <ImportDialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} onFinish={(data) => {
          setProxyData(data)
          setImportDialogOpen(false)
        }} />
        <SettingsDialog
          settings={{concurrency, socks5}}
          open={settingsDialogOpen} onClose={() => setSettingsDialogOpen(false)} onFinish={(data) => {
          if (data) {
            setConcurrency(data.concurrency)
            setSocks5(data.socks5)
          }
          setSettingsDialogOpen(false)
        }} />
      </Container>
    </Box>
  )
}
