'use client'

import { useTheme, Box, Typography, Button, Stack, Link } from '@mui/material'
import Spinner from '../../Spinner'
import { useDialogState } from '../DialogProvider'
import { BaseDialog } from './baseDialog'
import { useCallback, useMemo } from 'react'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded'

type TransactionModalProps = {
  title: string
  subTitle?: string
  link?: string
  status: 'pending' | 'success' | 'error'
  retryFunc?: () => void
  onClose?: () => void
  onSuccessClose?: () => void
}

export function useTransactionModal() {
  const { open, close, isOpen, propsObject } = useDialogState<TransactionModalProps>('transactionModal')
  return {
    open,
    close,
    propsObject,
    isOpen
  }
}

export function TransactionModal() {
  const theme = useTheme()
  const { propsObject, isOpen, close: closeDialog } = useTransactionModal()

  const close = useCallback(() => {
    propsObject?.onClose?.()
    closeDialog()
  }, [closeDialog, propsObject])

  const status = useMemo(() => propsObject?.status ?? 'pending', [propsObject])

  const bottomChildren = useMemo(() => {
    if (status === 'pending') {
      return (
        <Button fullWidth variant="contained" disabled>
          Waiting
        </Button>
      )
    } else if (status === 'error') {
      return (
        <Stack spacing={'20px'} direction={'row'} width="100%">
          <Button fullWidth variant="outlined" onClick={close}>
            Close
          </Button>
          <Button fullWidth variant="contained" onClick={propsObject?.retryFunc}>
            Retry
          </Button>
        </Stack>
      )
    }
    return (
      <Button
        fullWidth
        variant="contained"
        onClick={() => {
          propsObject?.onSuccessClose?.()
          closeDialog()
        }}
      >
        OK
      </Button>
    )
  }, [close, closeDialog, propsObject, status])

  const icon = useMemo(() => {
    if (status === 'success') {
      return <CheckCircleRoundedIcon color="success" fontSize="large" />
    } else if (status === 'error') {
      return <ErrorRoundedIcon color="error" fontSize="large" />
    }
    return <Spinner size="40px" />
  }, [status])

  return (
    <BaseDialog
      open={isOpen}
      onClose={close}
      bottomChildren={bottomChildren}
      minWidth={'480px'}
      width={'480px'}
      hiddenTitle
    >
      <Box display="grid" padding="40px 24px" gap="24px" justifyItems="center">
        {icon}
        <Typography fontWeight={400} fontSize={18}>
          {propsObject?.title ?? 'Waiting For Confirmation'}
        </Typography>
        <Typography
          fontWeight={400}
          fontSize={14}
          textAlign="center"
          color={theme.palette.text.secondary}
          sx={{
            wordBreak: 'break-word'
          }}
        >
          {propsObject?.subTitle ?? 'Please initiate transaction in your wallet'}
        </Typography>
        {propsObject?.link && (
          <Link href={propsObject.link} mt={'-15px'} sx={{ fontSize: '14px' }} target="_blank" underline="always">
            View on Explorer
          </Link>
        )}
      </Box>
    </BaseDialog>
  )
}
