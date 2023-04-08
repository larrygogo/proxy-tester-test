import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {ProxyInfo} from "@/types/proxy";
import {v4 as uuidV4} from "uuid";
import {useEffect, useState} from "react";

type Props = {
  onClose?: () => void
  onFinish?: (proxyList: ProxyInfo[]) => void
  open: boolean
}

const ImportDialog = (props: Props) => {
  const {onClose, onFinish, open} = props
  const [text, setText] = useState('')

  const handleImport = async () => {
    const proxyList: ProxyInfo[] = text.split('\n').map((c) => c.trim()).filter((c) => c.length > 0).map((c) => {
      const [host, port, username, password] = c.split(':')
      return {
        id: uuidV4(),
        host,
        port,
        username,
        password,
      }
    }).filter((c) => c.host && c.port)
    console.log(proxyList)
    onFinish && onFinish(proxyList)
  }

  useEffect(() => {
    setText('')
  }, [open])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>IMPORT PROXIES</DialogTitle>
      <DialogContent>
        <Box sx={{minWidth: 500}}>
          <TextField
            value={text}
            fullWidth
            variant="outlined"
            multiline
            rows={6}
            onChange={(e) => setText(e.target.value)}
            placeholder="HOST:PORT:USERNAME:PASSWORD"
            InputProps={{
              sx:{
                fontSize: 12,
              }
            }}
          >
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleImport}>
          Import
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ImportDialog