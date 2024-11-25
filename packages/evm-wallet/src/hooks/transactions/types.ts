export interface TransactionDetails {
  hash: string
  chainId: number
  from: string
  addedTime: number
  confirmedTime?: number
  lastCheckedBlockNumber?: number
  receipt?: {
    status: 'success' | 'reverted'
    from: string
    to: string | null
  }
  summary?: string
  key?: string
}

export interface TransactionState {
  transactions: {
    [chainId: number]: {
      [txHash: string]: TransactionDetails
    }
  }
}
