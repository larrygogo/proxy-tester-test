// ** MUI Imports
import { Theme } from '@mui/material/styles'

const Autocomplete = (theme: Theme) => {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
        }
      }
    }
  }
}

export default Autocomplete
