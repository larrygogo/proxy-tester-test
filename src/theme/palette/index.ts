// ** Type Imports
import { PaletteMode } from '@mui/material'
import {ThemeColor} from "@/layouts/types";
import {hexToRGBA} from "@/utils/hex-to-rgba";

const DefaultPalette = (mode: PaletteMode, themeColor: ThemeColor) => {
  // ** Vars
  const lightColor = '#14171C'
  const darkColor = '#FFFFFF'

  const mainColor = mode === 'light' ? lightColor : darkColor

  const primaryGradient = () => {
    return themeColor.main
  }

  const defaultBgColor = () => {
    if (mode === 'light') {
      return '#F8F8F8'
    } else return '#14171C'
  }

  return {
    customColors: {
      dark: themeColor.dark,
      main: themeColor.main,
      light: themeColor.light,
      darkBg: '#242d3d',
      lightBg: '#F4F5FA',
      primaryGradient: primaryGradient(),
      tableHeaderBg: mode === 'light' ? '#F9FAFC' : '#374359',
      glassCardBg: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(17, 20, 25, 0.8)'
    },
    common: {
      black: '#000',
      white: '#FFF'
    },
    mode: mode,
    primary: {
      light: themeColor.light,
      main: themeColor.main,
      dark: themeColor.dark,
      contrastText: '#FFF'
    },
    secondary: {
      light: '#9C9FA4',
      main: '#8A8D93',
      dark: '#777B82',
      contrastText: '#FFF'
    },
    success: {
      light: '#6AD01F',
      main: '#56CA00',
      dark: '#4CB200',
      contrastText: '#FFF'
    },
    error: {
      light: '#FF6166',
      main: '#FF4C51',
      dark: '#E04347',
      contrastText: '#FFF'
    },
    warning: {
      light: '#FFCA64',
      main: '#FFB400',
      dark: '#E09E00',
      contrastText: '#FFF'
    },
    info: {
      light: '#32BAFF',
      main: '#16B1FF',
      dark: '#139CE0',
      contrastText: '#FFF'
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#D5D5D5',
      A200: '#AAAAAA',
      A400: '#616161',
      A700: '#303030'
    },
    text: {
      primary: hexToRGBA(mainColor, 0.87),
      secondary: hexToRGBA(mainColor, 0.4),
      disabled: hexToRGBA(mainColor, 0.38),
    },
    divider: hexToRGBA(mainColor, 0.12),
    background: {
      paper: mode === 'light' ? '#FFFFFF' : '#232730',
      default: defaultBgColor()
    },
    action: {
      active: hexToRGBA(mainColor, 0.1),
      hover: hexToRGBA(mainColor, 0.04),
      selected: hexToRGBA(mainColor, 0.08),
      disabled: hexToRGBA(mainColor, 0.3),
      disabledBackground: hexToRGBA(mainColor, 0.18),
      focus: hexToRGBA(mainColor, 0.12),
    }
  }
}

export default DefaultPalette
