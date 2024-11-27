import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit'
import { useMemo } from 'react'
import { useCoinCurrency } from './useCoinCurrency'
import { SUI_COIN } from '../constants'
import { CurrencyAmount } from '../constants/currencyAmount'

export function useSuiBalance(address?: string) {
  const _address = useCurrentAccount()?.address
  address = address ?? _address
  const { data: userBal } = useSuiClientQuery(
    'getBalance',
    {
      owner: address || '',
      coinType: SUI_COIN
    },
    {
      enabled: !!address,
      queryKey: [`SUI_BALANCE_${address}`],
      refetchInterval: 5_000
    }
  )
  const _balance = useMemo(() => {
    if (userBal) {
      return CurrencyAmount.ether(userBal.totalBalance)
    }
    return undefined
  }, [userBal])
  return _balance
}

export function useCoinBalance(coinType: string, address?: string) {
  const currency = useCoinCurrency(coinType)
  const _address = useCurrentAccount()?.address
  address = address ?? _address
  const { data: userBal } = useSuiClientQuery(
    'getBalance',
    {
      owner: address || '',
      coinType: coinType
    },
    {
      enabled: !!address && !!coinType,
      queryKey: [`USER_BALANCE_${address}_${coinType}`],
      refetchInterval: 5_000
    }
  )

  const _balance = useMemo(() => {
    if (currency && userBal) {
      return new CurrencyAmount(currency, userBal.totalBalance)
    }
    return undefined
  }, [currency, userBal])
  return _balance
}
