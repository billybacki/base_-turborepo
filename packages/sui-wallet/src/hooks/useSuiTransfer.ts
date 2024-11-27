import { useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { useCallback } from 'react'

export function useSuiTransfer() {
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction()

  return useCallback(
    async (amount: string, recipientAddress: string) => {
      const txb = new Transaction()
      const gas = txb.gas
      const coin = txb.splitCoins(gas, [amount])
      txb.transferObjects([coin], recipientAddress)
      await signAndExecuteTransaction({ transaction: txb })
    },
    [signAndExecuteTransaction]
  )
}

export function useTokenTransfer() {
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction()

  return useCallback(
    async (amount: string, recipientAddress: string, tokenObjectId: string) => {
      const txb = new Transaction()
      const tokenObject = txb.object(tokenObjectId)
      const coin = txb.splitCoins(tokenObject, [amount])
      txb.transferObjects([coin], recipientAddress)
      await signAndExecuteTransaction({ transaction: txb })
    },
    [signAndExecuteTransaction]
  )
}
