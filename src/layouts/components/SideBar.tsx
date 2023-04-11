import {Box} from "@mui/material";

const SideBar = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        alignSelf: 'stretch',
        width: 60,
      }}
    >
      <Box data-tauri-drag-region sx={{height: 30}} />
    </Box>
  )
}

export default SideBar