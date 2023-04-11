// ** React Imports
import { ReactNode } from 'react'

// ** MUI Imports
import { Theme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { ThemeProvider, createTheme } from '@mui/material/styles'

// ** Type Imports
import {LayoutConfig} from '@/context/types'

// ** Theme Override Imports
import overrides from './overrides'
import typography from './typography'

// ** Theme
import themeOptions from './ThemeOptions'

// ** Global Styles
import GlobalStyling from './globalStyles'

interface Props {
  config: LayoutConfig
  children: ReactNode
}

const ThemeComponent = (props: Props) => {
  // ** Props
  const { config, children } = props

  // ** Merged ThemeOptions of Core and User
  const coreThemeConfig = themeOptions(config)

  // ** Pass ThemeOptions to CreateTheme Function to create partial theme without component overrides
  let theme = createTheme(coreThemeConfig)
  // ** Deep Merge Component overrides of core and user
  const mergeComponentOverrides = (theme: Theme, config: LayoutConfig) => overrides(theme, config)

  // ** Deep Merge Typography of core and user
  const mergeTypography = (theme: Theme) => typography(theme)

  // ** Continue theme creation and pass merged component overrides to CreateTheme function
  theme = createTheme(theme, {
    components: { ...mergeComponentOverrides(theme, config) },
    typography: { ...mergeTypography(theme) }
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={() => GlobalStyling(theme, config) as any} />
      {children}
    </ThemeProvider>
  )
}

export default ThemeComponent
