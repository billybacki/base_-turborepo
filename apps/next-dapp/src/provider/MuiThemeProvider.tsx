'use client'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import { CssBaseline, StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material'
import React, { useEffect, useMemo } from 'react'
import { useUpdateThemeMode } from 'state/application/hooks'
import { getCustomTheme, getDesignSystemTheme } from 'themes'

const MuiThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mode, setThemeMode, getLocalThemeMode } = useUpdateThemeMode()

  useEffect(() => {
    const localThemeMode = getLocalThemeMode()
    if (localThemeMode !== mode) {
      setThemeMode(localThemeMode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const theme = useMemo(() => createTheme(getDesignSystemTheme(mode)), [mode])

  return (
    <StyledEngineProvider injectFirst>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline enableColorScheme />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </StyledEngineProvider>
  )
}
export default MuiThemeProvider

export function MuiCustomThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={createTheme(getCustomTheme())}>{children}</ThemeProvider>
}
