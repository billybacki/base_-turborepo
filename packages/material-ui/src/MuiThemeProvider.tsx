import { Theme, ThemeProvider } from '@mui/material'
import { defaultTheme } from './theme'
import CssBaseline from '@mui/material/CssBaseline'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'

export function MuiThemeProvider({
  children,
  theme,
  isAppRouter = false
}: {
  children: React.ReactNode
  isAppRouter?: boolean
  theme?: Partial<Theme> | ((outerTheme: Theme) => Theme)
}) {
  if (isAppRouter) {
    return (
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme ?? defaultTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    )
  }
  return (
    <ThemeProvider theme={theme ?? defaultTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
