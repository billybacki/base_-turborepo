export interface TransactionDetails {
  hash: string
  chainId: number
  from: string
  addedTime: number
  confirmedTime?: number
  receipt?: unknown
  summary?: string
}

export interface TransactionState {
  transactions: {
    [chainId: number]: {
      [txHash: string]: TransactionDetails
    }
  }
}
