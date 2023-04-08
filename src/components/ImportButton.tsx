import {Button} from "@mui/material";
import {WebviewWindow} from "@tauri-apps/api/window";
import {invoke} from "@tauri-apps/api/tauri";
import { appWindow } from '@tauri-apps/api/window';

type Props = {
  onClick?: () => void
}

const ImportButton = (props: Props) => {
  const {onClick} = props

  const handleClick = async () => {

    // const webview = new WebviewWindow('theUniqueLabel', {
    //   title: 'Import Proxy',
    //   url: '/import_proxy',
    //   width: 400,
    //   height: 300,
    //   focus: true,
    // })
    // await webview.once('tauri://close', () => {
    //   webview.close()
    // })
    // await webview.show()
    onClick && onClick()
  }

  return (
    <Button
      color="primary"
      onClick={handleClick}
    >
      Import Proxies
    </Button>
  );
};

export default ImportButton;
