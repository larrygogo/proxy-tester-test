// ** MUI Imports
import {css, Theme} from '@mui/material/styles'

// ** Type Imports
import {LayoutConfig} from '@/context/types'

// ** Util Import
import {hexToRGBA} from '@/utils/hex-to-rgba'
import {deepmerge} from "@mui/utils";

const GlobalStyles = (theme: Theme, template: LayoutConfig) => {
  // ** Vars
  const {mode} = template

  const perfectScrollbarThumbBgColor = () => {
    if (mode === 'light') {
      return '#C2C4D1 !important'
    } else {
      return '#504B6D !important'
    }
  }

  const styleString = css`
  @font-face {
    font-family: 'Nunito';
    src: url(/fonts/Nunito/Nunito-ExtraLight.ttf);
    font-weight: 200;
    font-style: normal;
  }
  @font-face {
    font-family: 'Nunito';
    src: url(/fonts/Nunito/Nunito-ExtraLightItalic.ttf);
    font-weight: 200;
    font-style: italic;
  }
  @font-face {
    font-family: 'Nunito';
    src: url(/fonts/Nunito/Nunito-Light.ttf);
    font-weight: 300;
    font-style: normal;
  }
  @font-face {
    font-family: 'Nunito';
    src: url(/fonts/Nunito/Nunito-LightItalic.ttf);
    font-weight: 300;
    font-style: italic;
  }
  @font-face {
    font-family: 'Nunito';
    src: url(/fonts/Nunito/Nunito-Regular.ttf);
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: 'Nunito';
    src: url(/fonts/Nunito/Nunito-RegularItalic.ttf);
    font-weight: 400;
    font-style: italic;
  }
  @font-face {
    font-family: 'Nunito';
    src: url(/fonts/Nunito/Nunito-SemiBold.ttf);
    font-weight: 600;
    font-style: normal;
  }
  @font-face {
    font-family: 'Nunito';
    src: url(/fonts/Nunito/Nunito-SemiBoldItalic.ttf);
    font-weight: 600;
    font-style: italic;
  }
  @font-face {
    font-family: 'Nunito';
    src: url(/fonts/Nunito/Nunito-Bold.ttf);
    font-weight: 700;
    font-style: normal;
  }
  @font-face {
    font-family: 'Nunito';
    src: url(/fonts/Nunito/Nunito-BoldItalic.ttf);
    font-weight: 700;
    font-style: italic;
  }
  @font-face {
    font-family: 'Nunito';
    src: url(/fonts/Nunito/Nunito-ExtraBold.ttf);
    font-weight: 800;
    font-style: normal;
  }
  @font-face {
    font-family: 'Nunito';
    src: url(/fonts/Nunito/Nunito-ExtraBoldItalic.ttf);
    font-weight: 800;
    font-style: italic;
  }
  @font-face {
    font-family: 'Nunito';
    src: url(/fonts/Nunito/Nunito-Black.ttf);
    font-weight: 900;
    font-style: normal;
  }
  @font-face {
    font-family: 'Nunito';
    src: url(/fonts/Nunito/Nunito-BlackItalic.ttf);
    font-weight: 900;
    font-style: italic;
  }`

  return deepmerge({
    // 旋转
    '@keyframes rotate': {
      '0%': {
        transform: 'rotate(0deg)'
      },
      '100%': {
        transform: 'rotate(360deg)'
      }
    },
    // 禁止选择
    '*': {
      userSelect: 'none',
      cursor: 'default'
    },
    'body': {
      overflow: 'hidden',
    },
    'body[style^="padding-right"] .layout-navbar-and-nav-container::after': {
      content: '""',
      position: 'absolute' as const,
      left: '100%',
      top: 0,
      height: '100%',
      backgroundColor: hexToRGBA(theme.palette.background.paper, 0.85),
      width: '30px'
    },
    '.demo-space-x > *': {
      marginTop: '1rem !important',
      marginRight: '1rem !important',
      'body[dir="rtl"] &': {
        marginRight: '0 !important',
        marginLeft: '1rem !important'
      }
    },
    '.demo-space-y > *:not(:last-of-type)': {
      marginBottom: '1rem'
    },
    '.MuiGrid-container.match-height .MuiCard-root': {
      height: '100%'
    },
    '.ps__rail-y': {
      zIndex: 1,
      right: '0 !important',
      left: 'auto !important',
      '&:hover, &:focus, &.ps--clicking': {
        backgroundColor: theme.palette.mode === 'light' ? '#E4E5EB !important' : '#423D5D !important'
      },
      '& .ps__thumb-y': {
        right: '3px !important',
        left: 'auto !important',
        backgroundColor: theme.palette.mode === 'light' ? '#C2C4D1 !important' : '#504B6D !important'
      },
      '.layout-vertical-nav &': {
        '& .ps__thumb-y': {
          width: 4,
          backgroundColor: perfectScrollbarThumbBgColor()
        },
        '&:hover, &:focus, &.ps--clicking': {
          backgroundColor: 'transparent !important',
          '& .ps__thumb-y': {
            width: 6
          }
        }
      }
    },

    '#nprogress': {
      pointerEvents: 'none',
      '& .bar': {
        left: 0,
        top: 0,
        height: 3,
        width: '100%',
        zIndex: 2000,
        position: 'fixed',
        backgroundColor: theme.palette.primary.main
      }
    }
  }, styleString)
}

export default GlobalStyles
