import {Box} from "@mui/material";
import Image from "next/image";

const Header = () => {
  return (
    <Box
      component="header"
      // tauri允许拖动
      data-tauri-drag-region
      sx={{
        // height: 30
      }}
    >
      <Box
        data-tauri-drag-region
        sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      >
        <Image src="/images/logo.svg" alt="logo" width="60" height="30"  />
      </Box>
    </Box>
  )
}

export default Header