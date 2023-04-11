import {LayoutProps} from "./types";
import {Box} from "@mui/material";
import Header from "@/layouts/components/Header";
import SideBar from "@/layouts/components/SideBar";

const Layout = (props: LayoutProps) => {
  const {children} = props;

  return (
    <Box
      id="Layout"
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'stretch',
        backgroundColor: 'background.paper',
        backdropFilter: 'blur(10px)',
      }}
    >
      <SideBar/>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyItems: 'stretch',
      }}>
        <Header/>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#2c303a',
            borderTopLeftRadius: theme => theme.spacing(3),
            flex: 1,
            alignItems: 'stretch',
          }}
        >
          {children}
        </Box>

      </Box>
    </Box>
  )
}
export default Layout;
