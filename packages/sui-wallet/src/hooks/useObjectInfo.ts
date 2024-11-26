import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit'
import { useCallback } from 'react'
import { Transaction } from '@mysten/sui/transactions'
import { SUI_COIN } from '../constants'

export function useCoinObjectInfo(coinType?: string) {
  const account = useCurrentAccount()
  const cursor: string | undefined | null = null
  const { data } = useSuiClientQuery(
    'getCoins',
    {
      owner: account?.address || '',
      coinType: coinType || SUI_COIN,
      cursor
    },
    {
      enabled: !!account?.address,
      refetchInterval: 5_000
    }
  )
  return data?.data?.[0]
}

export function useCoinsObjectInfo() {
  const account = useCurrentAccount()
  const cursor: string | undefined | null = null
  const { data } = useSuiClientQuery(
    'getCoins',
    {
      owner: account?.address || '',
      coinType: SUI_COIN,
      cursor
    },
    {
      enabled: !!account?.address,
      refetchInterval: 5_000
    }
  )
  return data?.data
}

export function useGetCoinMerge() {
  const account = useCurrentAccount()
  const list = useCoinsObjectInfo()
  return useCallback(
    async (tx: Transaction) => {
      if (!account?.address || !list) return
      let allCoinDatas: any[] = []
      allCoinDatas = list.map(item => item)
      if (allCoinDatas.length > 2) {
        tx.mergeCoins(
          tx.object(allCoinDatas[1]?.coinObjectId),
          allCoinDatas?.slice(2, allCoinDatas.length).map(item => {
            return tx.object(item.coinObjectId)
          })
        )
      }
      return allCoinDatas
    },
    [account?.address, list]
  )
}
