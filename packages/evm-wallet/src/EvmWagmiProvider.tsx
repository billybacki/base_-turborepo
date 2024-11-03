'use client'
import { ResolvedRegister, WagmiProvider } from 'wagmi'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { EvmWalletProvider } from './EvmWalletContent'

const queryClient = new QueryClient()

export function EvmWagmiProvider({
  wagmiConfig,
  supportedChainIds,
  children
}: {
  wagmiConfig: ResolvedRegister['config']
  supportedChainIds: number[]
  children: React.ReactNode
}) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <EvmWalletProvider supportedChainIds={supportedChainIds}>{children}</EvmWalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
