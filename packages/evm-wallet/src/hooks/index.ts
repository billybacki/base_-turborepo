'use client'

import { useAccount, useChainId } from 'wagmi'
import { useEvmWalletContext } from '../EvmWalletContent'
import { useMemo } from 'react'
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'

export function useActiveWeb3React() {
  return useEvmWallet()
}

export function useEvmWallet() {
  const { supportedChainIds } = useEvmWalletContext()
  const chainId = useChainId()
  const { chain, address } = useAccount()
  const isSupportChain = useMemo(
    () => (chain?.id ? Number(chain?.id) === Number(chainId) && supportedChainIds.includes(Number(chainId)) : false),
    [chain, chainId, supportedChainIds]
  )

  return useMemo(
    () => ({
      account: address,
      chainId: chainId,
      isSupportChain
    }),
    [address, chainId, isSupportChain]
  )
}

export function useRainbowkitModal() {
  return {
    useChainModal,
    useConnectModal
  }
}
