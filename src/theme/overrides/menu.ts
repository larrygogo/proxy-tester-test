// ** MUI Imports
import { Theme } from '@mui/material/styles'

const Menu = (theme: Theme) => {
  const boxShadow = () => {
    if (theme.palette.mode === 'light') {
      return theme.shadows[8]
    } else return theme.shadows[9]
  }

  return {
    MuiMenu: {
      styleOverrides: {
        root: {
          '& .MuiMenu-paper': {
            borderRadius: 5,
            boxShadow: boxShadow(),
          }
        }
      }
    }
  }
}

export default Menu
