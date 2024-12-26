import { Theme, ThemeProvider } from '@mui/material'
import { defaultTheme } from './theme'
import CssBaseline from '@mui/material/CssBaseline'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import { DialogProvider, NotificationProvider, TransactionModal } from '.'

type MuiThemeProviderProps = {
  children: React.ReactNode
  isAppRouter?: boolean
  theme?: Partial<Theme> | ((outerTheme: Theme) => Theme)
  disableCssBaseline?: boolean
  standalone?: boolean
}

export function MuiThemeProvider({
  children,
  theme,
  isAppRouter = false,
  disableCssBaseline = false,
  standalone = true
}: MuiThemeProviderProps) {
  const content = (
    <>
      {!disableCssBaseline && <CssBaseline />}
      <DialogProvider>
        <TransactionModal />
        <NotificationProvider>{children}</NotificationProvider>
      </DialogProvider>
    </>
  )

  if (!standalone) {
    return content
  }

  if (isAppRouter) {
    return (
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme ?? defaultTheme}>{content}</ThemeProvider>
      </AppRouterCacheProvider>
    )
  }

  return <ThemeProvider theme={theme ?? defaultTheme}>{content}</ThemeProvider>
}
