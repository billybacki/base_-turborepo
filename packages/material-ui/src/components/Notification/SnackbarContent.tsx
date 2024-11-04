import { CustomContentProps, enqueueSnackbar } from 'notistack'
import { Alert, Box } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import React from 'react'

export const SnackbarContent = React.forwardRef<HTMLDivElement, CustomContentProps>(
  ({ id, message, variant = 'default' }, ref) => {
    return (
      <Box ref={ref} sx={{ maxWidth: '400px' }}>
        <Alert
          severity={variant === 'default' ? 'info' : variant}
          action={
            <IconButton size="small" color="inherit" onClick={() => enqueueSnackbar.close(id)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {message}
        </Alert>
      </Box>
    )
  }
)

SnackbarContent.displayName = 'SnackbarContent'
