import invariant from 'tiny-invariant'
import BigNumber from 'bignumber.js'
import { Address, getAddress, parseUnits } from 'viem'
import { normalizeSuiAddress } from '@mysten/sui/dist/cjs/utils'

export function validateAndParseEVMAddress(address: string): Address {
  try {
    return getAddress(address)
  } catch (error) {
    invariant(false, `${address} is not a valid address.`)
  }
}

export function parseAmount(value: string, decimals = 18): BigNumber {
  // const parts = value.split('.')
  // if (parts.length > 2) throw new Error('Invalid number format')

  // if (parts.length === 2) {
  //   parts[1] = parts[1]!.slice(0, decimals)
  // }

  // return new BigNumber(parts.join('.'))

  return new BigNumber(parseUnits(value, decimals).toString())
}

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
