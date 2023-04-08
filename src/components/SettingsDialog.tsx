import {useEffect, useState} from "react";
import {
  Box, Button,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Switch,
  TextField
} from "@mui/material";

type Props = {
  settings: Settings
  open: boolean
  onClose?: () => void
  onFinish?: (data?: Settings) => void
}

const SettingsDialog = (props: Props) => {
  const {settings, open, onClose, onFinish} = props
  const [socks5Enabled, setSocks5Enabled] = useState(settings.socks5)
  // 并发数
  const [concurrency, setConcurrency] = useState(settings.concurrency)

  const handleSave = () => {
    onFinish?.({
      concurrency,
      socks5: socks5Enabled
    })
  }

  useEffect(() => {
    setSocks5Enabled(settings.socks5)
    setConcurrency(settings.concurrency)
  }, [settings])

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Setting</DialogTitle>
      <DialogContent>
        <Box sx={{display: 'flex', flexDirection: 'column', minWidth: 500, pt: 2}}>
          <TextField label="Concurrency" id="concurrency" value={concurrency} onChange={e => setConcurrency(parseInt(e.target.value))}/>
          <FormControl sx={{mt: 5}}>
            <FormLabel>Socks5 Enabled</FormLabel>
            <Switch checked={socks5Enabled} onChange={e => setSocks5Enabled(e.target.checked)}/>
          </FormControl>
        </Box>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}

export default SettingsDialog