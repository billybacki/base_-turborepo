import { darken } from '@mui/material'
import { IDefaultColor } from './types'

export const defaultThemeColorOptions: IDefaultColor = {
  light: {
    white: '#fff',
    black: '#121212',
    blue: 'blue'
  },
  dark: {
    white: '#000',
    black: '#fff',
    blue: 'blue'
  }
}

export const defaultThemeLightColors = {
  primary: {
    light: '#ADDFB5',
    main: '#1F9898',
    dark: darken('#1F9898', 0.3),
    contrastText: '#1A1C1E'
  },
  secondary: {
    light: '#31B047',
    main: '#99F7F4',
    dark: '#00E4DD',
    contrastText: '#1A1C1E'
  },
  error: {
    main: '#FA0E0E',
    light: '#FA0E0E10'
  },
  warning: {
    main: '#F0B90B'
  },
  info: {
    main: '#1F9898'
  },
  success: {
    main: '#31B047'
  },
  background: {
    default: '#F7F7F7',
    paper: '#FFFFFF',
    secondary: '#484D50'
  },
  text: {
    primary: '#333333',
    secondary: '#828282',
    disabled: '#828282'
  },
  action: {
    disabledOpacity: 0.6,
    disabledBackground: '#F7F7F7'
  }
}

export const defaultThemeDarkColors = {
  primary: {
    light: '#ADDFB5',
    main: '#D8FF20',
    dark: darken('#D8FF20', 0.2),
    contrastText: '#1A1C1E'
  },
  secondary: {
    light: '#31B047',
    main: '#99F7F4',
    dark: '#00E4DD',
    contrastText: '#ffffff'
  },
  error: {
    main: '#FA0E0E',
    light: '#FA0E0E10'
  },
  warning: {
    main: '#F0B90B'
  },
  info: {
    main: '#1F9898'
  },
  success: {
    main: '#31B047'
  },
  background: {
    default: '#343739',
    paper: '#1A1C1E'
  },
  text: {
    primary: '#E6EAEE',
    secondary: '#878D92',
    disabled: '#61666A'
  },
  action: {
    disabledOpacity: 0.6,
    disabledBackground: '#343739'
  }
}

export const customThemeColors = {
  palette: {
    primary: {
      light: '#3F8CFF',
      main: '#0049C6',
      dark: '#002685',
      contrastText: '#ffffff'
    },
    secondary: {
      light: '#FFEBF6',
      main: '#FFA2C0',
      dark: '#FFB7F5',
      contrastText: '#ffffff'
    },
    error: {
      main: '#E46767'
    },
    warning: {
      main: '#FFCE73'
    },
    info: {
      main: '#F0B90B'
    },
    success: {
      main: '#31B047'
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#3f5170',
      secondary: '#808191',
      disabled: '#b4b2b2'
    },
    action: {
      disabledOpacity: 0.8
    },
    grey: {
      A700: '#191919',
      A400: '#252525',
      A200: '#303030',
      A100: '#A1A1A1'
    }
  },
  borderRadius: {
    default: '8px'
  },
  boxShadow: {
    bs1: 'inset 0px -1px 0px #E4E4E4',
    bs2: 'rgb(174 174 174 / 20%) 0px 0px 5px'
  },
  gradient: {
    gradient1: '#ffffff linear-gradient(154.62deg, #77C803 9.44%, #28A03E 59.25%);'
  },
  height: {
    header: '80px',
    mobileHeader: '50px'
  },
  width: {
    sidebar: '250px',
    maxContent: '1110px'
  },
  shape: {
    border: '1px solid',
    borderRadius: 8
  },
  zIndex: {
    modal: 99999
  },
  spacing: (factor: number) => `${1 * factor}px`
  // gray: {
  //   main: '#333333',
  //   dark: '#262626',
  // },
}
