'use client'
import React from 'react'
import {
  Dialog as MuiDialog,
  DialogContent,
  Typography,
  DialogTitle,
  DialogProps as MuiDialogProps,
  styled,
  IconButton,
  SxProps,
  Theme,
  useTheme,
  useMediaQuery,
  DialogActions
} from '@mui/material'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'

const BaseMuiDialog = styled(MuiDialog)(() => ({
  '& .MuiModal-backdrop': {
    backdropFilter: 'blur(24px)'
  },
  '& .MuiDialog-paper': {
    padding: '32px 24px',
    borderRadius: 16,
    backgroundImage: 'none',
    width: 'fit-content'
  },
  '& .MuiDialogContent-root': {
    textAlign: 'unset'
  }
}))

export interface BaseDialogProps extends Omit<MuiDialogProps, 'open'> {
  open: boolean
  onClose?: () => void
  children: React.ReactNode
  title?: string
  close?: boolean
  disableBackClick?: boolean
  minWidth?: string
  width?: string
  hiddenTitle?: boolean
  closeIcon?: React.ReactNode
  headerEl?: React.ReactNode
  sx?: SxProps<Theme>
  bottomChildren?: React.ReactNode
}

export const BaseDialog = (props: BaseDialogProps) => {
  const theme = useTheme()
  const isSm = useMediaQuery(theme.breakpoints.down('sm'))

  const {
    sx,
    children,
    title,
    onClose,
    hiddenTitle,
    close = true,
    closeIcon,
    disableBackClick,
    minWidth = 400,
    width = 400,
    headerEl,
    bottomChildren,
    open,
    ...rest
  } = props

  const handleClose = (_: any, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (disableBackClick && reason === 'backdropClick') return
    onClose?.()
  }

  return (
    <BaseMuiDialog
      open={open ?? false}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      sx={{
        '& .MuiDialog-paper': {
          padding: { xs: '32px 20px', sm: '32px 24px' },
          minWidth: { xs: 'calc(100vw - 40px)', sm: minWidth },
          width: { sm: width },
          margin: { xs: 20, sm: 32 }
        },
        ...sx
      }}
      {...rest}
    >
      {!hiddenTitle && (
        <DialogTitle component={'div'} sx={{ padding: 0, height: 37 }}>
          <Typography
            variant="h3"
            sx={{
              width: { xs: 200, sm: 400 },
              fontSize: { xs: 20, sm: 28 },
              fontWeight: 500,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {title}
          </Typography>
        </DialogTitle>
      )}

      {headerEl}

      {close && (
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16, width: 20, height: 20 }}>
          {closeIcon ?? <HighlightOffIcon style={{ transform: isSm ? 'scale(.7)' : 'scale(1)' }} />}
        </IconButton>
      )}

      <DialogContent
        sx={{
          textAlign: 'center',
          p: 0,
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        {children}
      </DialogContent>

      {bottomChildren && <DialogActions>{bottomChildren}</DialogActions>}
    </BaseMuiDialog>
  )
}
