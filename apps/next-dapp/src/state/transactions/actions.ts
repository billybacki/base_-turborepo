import { createAction } from '@reduxjs/toolkit'
import { SupportedChainId } from '../../constants/chains'

export interface SerializableTransactionReceipt {
  to: string
  from: string
  contractAddress: string
  transactionIndex: number
  blockHash: string
  transactionHash: string
  blockNumber: number
  status?: number
}

export interface UserSubmittedProp {
  account: string
  action: string
  key?: string | number
}

export interface ITransactionCustomData {
  approval?: { tokenAddress: string; spender: string }
  claim?: { recipient: string }
  userSubmitted?: UserSubmittedProp
  summary?: string
}

export const addTransaction = createAction<
  {
    chainId: SupportedChainId
    hash: string
    from: string
  } & ITransactionCustomData
>('transactions/addTransaction')
export const clearAllTransactions = createAction<{ chainId: SupportedChainId }>('transactions/clearAllTransactions')
export const finalizeTransaction = createAction<{
  chainId: SupportedChainId
  hash: string
  receipt: SerializableTransactionReceipt
}>('transactions/finalizeTransaction')
export const checkedTransaction = createAction<{
  chainId: SupportedChainId
  hash: string
  blockNumber: number
}>('transactions/checkedTransaction')
