import { styled } from '@mui/material'
import { CSSProperties, ImgHTMLAttributes, useMemo, useState } from 'react'

const BAD_SRCS: { [x in string]: true } = {}

const StyleImage = styled('img')(() => ({}))

export default function Image({
  src,
  alt = '',
  style,
  className,
  altSrc,
  size,
  ...rest
}: {
  src: string
  alt?: string
  style?: React.CSSProperties
  className?: string
  altSrc?: string
  size?: number | string
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'style'>) {
  const [, refresh] = useState<number>(0)
  const srcs = useMemo(() => [src, altSrc], [src, altSrc])
  const srcStr = srcs.find(item => !BAD_SRCS[item ?? ''])

  const _styles = useMemo(() => {
    const sizeStyle: CSSProperties = { ...style } ?? {}
    if (size !== undefined) {
      sizeStyle.width = style?.width ?? size
      sizeStyle.height = style?.height ?? size
    }
    return sizeStyle
  }, [size, style])

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <StyleImage
      {...rest}
      src={srcStr}
      alt={alt}
      style={_styles}
      className={className}
      onError={() => {
        if (srcStr) BAD_SRCS[srcStr] = true
        refresh(i => i + 1)
      }}
    />
  )
}
