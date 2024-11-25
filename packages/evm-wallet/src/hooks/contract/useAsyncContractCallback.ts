import { useConfig } from 'wagmi'
import {
  Config,
  getTransactionReceipt,
  simulateContract,
  SimulateContractParameters,
  waitForTransactionReceipt
} from '@wagmi/core'
import { useCallback } from 'react'

export function useSimulateContractCallback() {
  const wagmiConfig = useConfig() as Config

  return useCallback(
    async (parameters: SimulateContractParameters) => {
      return await simulateContract(wagmiConfig, parameters)
    },
    [wagmiConfig]
  )
}

export function useWaitForTransactionReceiptCallback() {
  const wagmiConfig = useConfig() as Config

  return useCallback(
    async (hash: `0x${string}`) => {
      try {
        const receipt = await waitForTransactionReceipt(wagmiConfig, { hash, pollingInterval: 5_000, retryCount: 100 })
        return receipt
      } catch (error) {
        console.log('🚀 ~ error:', error)
        throw error
      }
    },
    [wagmiConfig]
  )
}

export function useGetTransactionReceiptCallback() {
  const wagmiConfig = useConfig() as Config

  return useCallback(
    async (hash: `0x${string}`) => {
      try {
        const receipt = await getTransactionReceipt(wagmiConfig, { hash })
        return receipt
      } catch (error) {
        console.log('🚀 ~ error:', error)
        throw error
      }
    },
    [wagmiConfig]
  )
}
