import { HTMLProps, useCallback } from 'react'
import { IconButton, Link, SxProps, Theme } from '@mui/material'
import MuiCloseIcon from '@mui/icons-material/Close'
import React from 'react'

export function CloseIcon({ onClick }: { onClick?: () => void }) {
  return (
    <IconButton
      onClick={onClick}
      size="large"
      sx={{
        padding: 0,
        position: 'absolute',
        top: '24px',
        right: '24px',
        '&:hover $closeIcon': {
          color: theme => theme.palette.text.primary
        }
      }}
    >
      <MuiCloseIcon sx={{ color: theme => theme.palette.grey[500] }} />
    </IconButton>
  )
}

export function ExternalLink({
  target = '_blank',
  href,
  rel = 'noopener noreferrer',
  style,
  sx,
  className,
  children,
  underline
}: Omit<HTMLProps<HTMLAnchorElement>, 'as' | 'ref' | 'onClick'> & {
  href: string
  style?: React.CSSProperties
  sx?: SxProps<Theme>
  underline?: 'always' | 'hover' | 'none'
  className?: string
}) {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (target === '_blank' || event.ctrlKey || event.metaKey) {
        /* empty */
      } else {
        event.preventDefault()
        window.location.href = href
      }
    },
    [href, target]
  )
  return (
    <Link
      className={className}
      target={target}
      rel={rel}
      href={href}
      onClick={handleClick}
      style={style}
      sx={sx}
      underline={underline ?? 'none'}
    >
      {children}
    </Link>
  )
}
