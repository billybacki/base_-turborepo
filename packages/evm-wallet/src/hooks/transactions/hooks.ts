import { useStore } from 'zustand'
import { createTxStore } from './store'
import { TransactionDetails } from './types'
import { useMemo } from 'react'
import { useEvmWallet } from '..'

export function useAddRecentTransaction() {
  return useStore(createTxStore).addTransaction
}

export function useUpdateRecentTransaction() {
  return useStore(createTxStore).updateTransaction
}

export function useClearRecentTransactions() {
  return useStore(createTxStore).clearAllTransactions
}

function useAllTransactionsByChainId(chainId: number) {
  const transactions = useStore(createTxStore).transactions
  return transactions[chainId]
}

function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

function isTransactionRecent(tx: TransactionDetails): boolean {
  return new Date().getTime() - tx.addedTime < 86_400_000
}

export function useSortedRecentTransactions() {
  const { account, chainId } = useEvmWallet()
  const allTransactions = useAllTransactionsByChainId(chainId)
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions || {})
    return txs
      .filter(isTransactionRecent)
      .sort(newTransactionsFirst)
      .filter(v => v.from.toUpperCase() === account?.toUpperCase())
  }, [account, allTransactions])

  const pendingTransactions = useMemo(
    () => sortedRecentTransactions.filter(tx => !tx.receipt),
    [sortedRecentTransactions]
  )
  const confirmedTransactions = useMemo(
    () => sortedRecentTransactions.filter(tx => tx.receipt),
    [sortedRecentTransactions]
  )
  return { sortedRecentTransactions, pendingTransactions, confirmedTransactions }
}
