import {Box, IconButton} from "@mui/material";
import Icon from "@/components/icon";
import {useRouter} from "next/router";
import NavButton from "@/layouts/components/NavButton";



const SideBar = () => {
  const router = useRouter()
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        alignSelf: 'stretch',
        width: 60,
      }}
    >
      <Box data-tauri-drag-region sx={{height: 30}}/>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}>
        <NavButton icon="mi:home" link="/"/>
        <NavButton icon="mi:settings" link="/settings"/>
      </Box>
    </Box>
  )
}

export default SideBar