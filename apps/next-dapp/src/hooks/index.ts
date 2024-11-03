import { useMemo } from 'react'
import { providers } from 'ethers'
import * as React from 'react'
import { useWalletClient, useChainId, useAccount } from 'wagmi'
import { CHAINS, ChainInfo, NETWORK_CHAIN_ID, SupportedChainId } from 'constants/chains'
import { WalletClient } from 'viem'

export function useActiveWeb3React(): {
  chainId?: SupportedChainId
  account?: string
  chainInfo?: ChainInfo
  library?: providers.Web3Provider
} {
  const chainId = useChainId()
  const { address } = useAccount()
  const provider = useEthersSigner({ chainId })

  return useMemo(
    () => ({
      account: address,
      chainInfo: CHAINS?.[chainId as SupportedChainId],
      chainId: chainId || NETWORK_CHAIN_ID,
      library: provider
    }),
    [address, chainId, provider]
  )
}

export function walletClientToSigner(walletClient: WalletClient) {
  const { chain, transport } = walletClient
  if (!chain) throw new Error('Not chain')
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address
  }
  const provider = new providers.Web3Provider(transport, network)
  return provider
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId })
  return React.useMemo(() => (walletClient ? walletClientToSigner(walletClient) : undefined), [walletClient])
}
