import { Alert, AlertTitle, Box } from '@mui/material'
import React, { forwardRef } from 'react'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

export const NotificationContent = forwardRef<
  HTMLDivElement,
  {
    title?: string
    message: string | React.ReactNode
    variant: 'success' | 'error' | 'warning' | 'info'
    onClose: () => void
    action?: React.ReactNode
  }
>(({ title, message, variant, onClose, action }, ref) => {
  return (
    <Box ref={ref} sx={{ maxWidth: '400px' }}>
      <Alert
        severity={variant}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {action}
            <IconButton aria-label="close" color="inherit" size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        }
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Box>
  )
})

NotificationContent.displayName = 'NotificationContent'
