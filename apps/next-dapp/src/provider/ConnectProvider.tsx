import { WagmiProvider } from 'wagmi'
import { sepolia, mainnet } from 'viem/chains'
import React from 'react'
// import { SupportedChainList } from '../constants/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''

const metadata = {
  name: 'base app',
  description: '',
  url: '', // origin must match your domain & subdomain
  icons: ['']
}

const config = defaultWagmiConfig({
  chains: [sepolia, mainnet],
  projectId,
  metadata,
  ssr: true
  // ...wagmiOptions // Optional - Override createConfig parameters
})

// export const wagmiConfig = createConfig({
//   chains: [sepolia, mainnet],
//   ssr: true,
//   connectors: [walletConnect({ projectId: projectId, showQrModal: false }), coinbaseWallet()],
//   transports: {
//     [mainnet.id]: http(),
//     [sepolia.id]: http()
//   }
// })

const queryClient = new QueryClient()

createWeb3Modal({
  themeVariables: {
    '--w3m-z-index': 10000
  },
  projectId,
  wagmiConfig: config,
  featuredWalletIds: [
    '8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4',
    'c03dfee351b6fcc421b4494ea33b9d4b92a984f87aa76d1663bb28705e95034a'
  ]
  // default show wallet type
  // chains: SupportedChainList
})

export default function ConnectProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
