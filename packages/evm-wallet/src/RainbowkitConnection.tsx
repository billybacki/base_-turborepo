'use client'

import React from 'react'
import { mainnet, sepolia } from 'viem/chains'
import { connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { walletConnectWallet, coinbaseWallet, metaMaskWallet, okxWallet } from '@rainbow-me/rainbowkit/wallets'
import { createConfig, http } from 'wagmi'
import { EvmWagmiProvider } from './EvmWagmiProvider'
import '@rainbow-me/rainbowkit/styles.css'
import { chains } from './constants'

const projectId = '41301e8365d2d65b321281fd10eab138'

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [walletConnectWallet, metaMaskWallet, okxWallet, coinbaseWallet]
    }
  ],
  {
    appName: 'title-interface',
    projectId: projectId
  }
)

const wagmiConfig = createConfig({
  connectors,
  chains,
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http()
  }
})

const wagmiSSRConfig = createConfig({
  connectors,
  chains,
  ssr: true,
  transports: {
    [sepolia.id]: http('https://sepolia.infura.io/v3/d6f8f688cda54a7aade4e8e4d8ece89b'),
    [mainnet.id]: http('https://mainnet.infura.io/v3/d6f8f688cda54a7aade4e8e4d8ece89b')
  }
})

export function RainbowkitConnection({ children, isSSR = false }: { children: React.ReactNode; isSSR?: boolean }) {
  return (
    <EvmWagmiProvider
      wagmiConfig={isSSR ? wagmiSSRConfig : wagmiConfig}
      supportedChainIds={chains.map(chain => chain.id)}
    >
      <RainbowKitProvider>{children}</RainbowKitProvider>
    </EvmWagmiProvider>
  )
}
