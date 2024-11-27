import { normalizeSuiAddress } from '@mysten/sui/utils'

export function formatCoinAddress(coinAddress: string) {
  const [address, module, type] = coinAddress.split('::')

  const normalizedAddress = normalizeSuiAddress(address || '')

  return {
    address: `${normalizedAddress}::${module}::${type}`,
    module,
    type
  }
}

export const isSuiAddress = (address: string) => {
  return address.endsWith('2::sui::SUI')
}
