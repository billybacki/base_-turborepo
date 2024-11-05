'use client'

import { useAccount, useChainId } from 'wagmi'
import { useEvmWalletContext } from '../EvmWalletContent'
import { useMemo } from 'react'
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'

/**
 * @deprecated Use useEvmWallet instead
 * @returns The active Web3 React context
 */
export function useActiveWeb3React() {
  return useEvmWallet()
}

/**
 * Hook to access the current EVM wallet state
 * @returns {Object} An object containing:
 * - account: The connected wallet address
 * - chainId: The current chain ID
 * - isSupportChain: Boolean indicating if the current chain is supported
 */
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

/**
 * Hook to access RainbowKit modal controls
 * @returns {Object} An object containing:
 * - useChainModal: Hook to control the chain selection modal
 * - useConnectModal: Hook to control the wallet connection modal
 */
export function useRainbowkitModal() {
  return {
    useChainModal,
    useConnectModal
  }
}
