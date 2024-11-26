import { useSuiClientQuery } from '@mysten/dapp-kit'
import { SUI_COIN } from '../constants'
import { Currency } from '../constants/currency'

export function useCoinCurrency(coinType?: string) {
  const address = coinType ?? SUI_COIN
  const { data } = useSuiClientQuery('getCoinMetadata', {
    coinType: address
  })
  if (!data?.id) {
    return
  }
  return new Currency(address, data.id, data.decimals, data.symbol, data.name, data.iconUrl || '', data.description)
}
