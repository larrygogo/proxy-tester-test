// ** MUI Theme Provider
import { ThemeOptions } from '@mui/material'

// ** Type Import
import { LayoutConfig } from '@/context/types'

// ** Theme Override Imports
import palette from './palette'
import spacing from './spacing'
import shadows from './shadows'
import breakpoints from './breakpoints'

const themeOptions = (template: LayoutConfig): ThemeOptions => {
  // ** Vars
  const { mode = 'light', themeColor } = template

  // ** Create New object before removing user component overrides and typography objects from userThemeOptions


  // ** Remove component overrides and typography objects from userThemeOptions

  return {
    palette: palette(mode, themeColor),
    typography: {
      fontFamily:
        [
          'Nunito',
          'Inter',
          'sans-serif',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"'
        ].join(',')
    },
    shadows: shadows(mode),
    ...spacing,
    breakpoints: breakpoints(),
    shape: {
      borderRadius: 6
    },
    mixins: {
      toolbar: {
        minHeight: 64
      }
    }
  }
}

export default themeOptions
