import {Alert, alpha, Box, Button, Container, IconButton, useTheme} from "@mui/material";
import ProxyVirtualizedTable from "@/components/ProxyVirtualizedTable";
import SettingsDialog from "@/components/SettingsDialog";
import ImportDialog from "@/components/ImportDialog";
import {yupResolver} from "@hookform/resolvers/yup";
import {Controller, useForm} from "react-hook-form";
import TargetInput from "@/components/home/TargetInput";
import {useEffect, useRef, useState} from "react";
import {ProxyDisplayInfo} from "@/types/proxy";
import {invoke} from "@tauri-apps/api/tauri";
import {TaskPool} from "@/utils/task";
import Icon from "@/components/icon";
import * as yup from "yup";

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
  const [proxyData, setProxyData] = useState<ProxyDisplayInfo[]>([])
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
    if (proxyData.length === 0) {
      setProgress(0)
      return
    }
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
    <Container sx={{height: '100%'}}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Box component="form" ref={formRef} onSubmit={onSubmit} sx={{py: 4}}>
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
                  ...(progress > 0 && {
                    // backgroundColor: alpha(theme.palette.background.paper, 0.2),
                    backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.light} ${progress / 2}%, ${theme.palette.primary.light} ${progress}%,  ${alpha(theme.palette.background.paper, 0.2)} ${progress}%, ${alpha(theme.palette.background.paper, 0.2)} 100%)`,

                  }),

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
                    <Button variant="contained" type="submit" sx={{borderRadius: 1.5}}>
                      <Icon icon="icon-park-outline:pause-one" color={theme.palette.error.main} fontSize={16}
                            style={{display: started ? 'block' : 'none'}}/>
                      <Icon icon="mi:play" color={theme.palette.text.primary} fontSize={16}
                            style={{display: started ? 'none' : 'block'}}/>
                    </Button>
                  </Box>
                }
              />
            }
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            pb: 4,
          }}
        >
          <ProxyVirtualizedTable
            data={proxyData}
            renderEmpty={() =>
              <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                <Button variant="contained" onClick={() => setImportDialogOpen(true)}>Import</Button>
              </Box>
            }
          />
        </Box>
      </Box>
      <ImportDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onFinish={(data) => setProxyData(data)}
      />
    </Container>
  )
}
