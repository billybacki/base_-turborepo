import { ReactNode } from 'react'
import Provider from './provider'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'title - title',
  description: 'description',
  icons: {
    icon: '/favicon.svg'
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  )
}
