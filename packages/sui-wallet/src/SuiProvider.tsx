import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'
import { ReactNode } from 'react'
import { networks } from './constants'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function SUIProvider({
  CURRENT_ENVIRONMENT,
  children
}: {
  CURRENT_ENVIRONMENT?: 'devnet' | 'testnet' | 'mainnet'
  children: ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork={CURRENT_ENVIRONMENT || 'mainnet'}>
        <WalletProvider autoConnect>{children}</WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  )
}
