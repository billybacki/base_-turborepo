'use client'
import { ResolvedRegister, WagmiProvider } from 'wagmi'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { EvmWalletProvider } from './EvmWalletContent'
import Updater from './hooks/transactions/updater'

const queryClient = new QueryClient()

export function EvmWagmiProvider({
  wagmiConfig,
  supportedChainIds,
  showTransactionNotification,
  children
}: {
  wagmiConfig: ResolvedRegister['config']
  supportedChainIds: number[]
  children: React.ReactNode
  showTransactionNotification?: boolean
}) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <EvmWalletProvider
          supportedChainIds={supportedChainIds}
          showTransactionNotification={showTransactionNotification}
        >
          <Updater />
          {children}
        </EvmWalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
