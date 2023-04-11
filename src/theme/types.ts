declare module '@mui/material/styles' {
  interface Palette {
    customColors: {
      componentBg: string
      dark: string
      main: string
      light: string
      glassCardBg: string
    }
  }
  interface PaletteOptions {
    customColors?: {
      componentBg?: string
      dark?: string
      main?: string
      light?: string
      glassCardBg?: string
    }
  }
}

export {}
