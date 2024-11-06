import invariant from 'tiny-invariant'
import BigNumber from 'bignumber.js'
import { Address, getAddress, parseUnits } from 'viem'

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
