import Icon from "@/components/icon";
import {Box} from "@mui/material";
import {useRouter} from "next/router";
import {handleURLQueries} from "@/utils/utils";

type Props = {
  icon: string
  link: string
}

const NavButton = (props: Props) => {
  const {icon, link} = props
  const router = useRouter()

  const isNavLinkActive = () => {
    return router.pathname === link || handleURLQueries(router, link);
  }

  return (
    <Box
      onClick={async () => {
        await router.push(link)
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        color: 'text.secondary',
        cursor: 'pointer',
        borderRadius: 2,
        backgroundColor: isNavLinkActive() ? 'background.default' : 'transparent',
        '&:hover': {
          color: 'text.primary',
          backgroundColor: 'background.default',
        }
      }}
    >
      <Icon icon={icon}/>
    </Box>
  )
}

export default NavButton