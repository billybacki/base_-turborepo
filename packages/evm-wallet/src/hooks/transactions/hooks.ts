import { useStore } from 'zustand'
import { createTxStore } from './store'
import { TransactionDetails } from './types'
import { useCallback, useMemo } from 'react'
import { useEvmWallet } from '..'

export function useAddRecentTransaction() {
  const addTransaction = useStore(createTxStore).addTransaction
  const { account, chainId } = useEvmWallet()

  return useCallback(
    (summary: string, hash: string, extraKey?: string) =>
      addTransaction({
        chainId,
        hash,
        summary,
        from: account ?? '',
        addedTime: Date.now(),
        lastCheckedBlockNumber: 0,
        receipt: undefined,
        confirmedTime: 0,
        key: `${account}_${chainId}_${extraKey ?? ''}`
      }),
    [account, addTransaction, chainId]
  )
}

export function useUpdateRecentTransaction() {
  return useStore(createTxStore).updateTransaction
}

export function useClearRecentTransactions() {
  return useStore(createTxStore).clearAllTransactions
}

export function useAllTransactionsByChainId(chainId: number) {
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

export function useTransactionState(extraKey?: string) {
  const { account, chainId } = useEvmWallet()
  const transactions = useAllTransactionsByChainId(chainId)

  const list = useMemo(() => {
    return Object.values(transactions ?? {}).filter(item => item.key === `${account}_${chainId}_${extraKey ?? ''}`)
  }, [account, chainId, extraKey, transactions])

  return {
    pending: list.some(item => !item.receipt),
    confirmed: list.some(item => item.receipt)
  }
}
