'use client'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { TransactionDetails, TransactionState } from './types'

type TransactionActions = {
  addTransaction: (tx: TransactionDetails) => void
  updateTransaction: (tx: TransactionDetails) => void
  clearAllTransactions: () => void
}

export const createTxStore: StoreApi<TransactionState & TransactionActions> = createStore<
  TransactionState & TransactionActions
>()(
  persist(
    immer(set => ({
      transactions: {},

      addTransaction: (tx: TransactionDetails) =>
        set(state => {
          const chainTxs = state.transactions[tx.chainId] || {}
          if (chainTxs[tx.hash]) {
            throw Error('Attempted to add existing transaction.')
          }
          state.transactions[tx.chainId] = {
            ...chainTxs,
            [tx.hash]: {
              ...tx,
              addedTime: Date.now()
            }
          }
        }),

      updateTransaction: (tx: TransactionDetails) =>
        set(state => {
          const chainTxs = state.transactions[tx.chainId] || {}
          if (!chainTxs[tx.hash]) {
            throw Error('Attempted to update non-existent transaction.')
          }
          state.transactions[tx.chainId] = {
            ...chainTxs,
            [tx.hash]: tx
          }
        }),

      clearAllTransactions() {
        set(() => {
          return { transactions: {} }
        })
      }
    })),
    {
      name: 'evm-transactions',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export function useTxStore() {
  return useStore(createTxStore)
}
