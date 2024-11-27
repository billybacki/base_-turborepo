import { normalizeSuiAddress } from '@mysten/sui/utils'
import JSBI from 'jsbi'
import invariant from 'tiny-invariant'
import { BigintIsh, SolidityType, ZERO } from '../constants'
import { Currency } from '../constants/SuiCurrency'
import { CurrencyAmount } from '../constants/currencyAmount'
import BigNumber from 'bignumber.js'

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

export function validateSolidityTypeInstance(value: JSBI, solidityType: SolidityType): void {
  invariant(JSBI.greaterThanOrEqual(value, ZERO), `${value} is not a ${solidityType}.`)
  invariant(JSBI.lessThanOrEqual(value, SOLIDITY_TYPE_MAXIMA[solidityType]), `${value} is not a ${solidityType}.`)
}

export function parseBigintIsh(bigintIsh: BigintIsh): JSBI {
  return bigintIsh instanceof JSBI
    ? bigintIsh
    : typeof bigintIsh === 'bigint'
      ? JSBI.BigInt(bigintIsh.toString())
      : JSBI.BigInt(bigintIsh)
}

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt('0xff'),
  [SolidityType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
}

export function parseUnits(value: string | number, decimals = 9) {
  return new BigNumber(value).multipliedBy(new BigNumber(10).pow(decimals))
}

export function tryParseAmount(value?: string, currency?: Currency): CurrencyAmount | undefined {
  if (!value || !currency) {
    return undefined
  }
  try {
    const str = value.split('.')
    if (str.length === 2) {
      value = `${str[0]}.${str[1]?.slice(0, currency.decimals)}`
    }
    const typedValueParsed = parseUnits(value, currency.decimals).toString()
    if (typedValueParsed !== '0') {
      return new CurrencyAmount(currency, JSBI.BigInt(typedValueParsed))
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
  // necessary for all paths to return a value
  return undefined
}

export function currencyEquals(currencyA: Currency, currencyB: Currency): boolean {
  if (currencyA instanceof Currency && currencyB instanceof Currency) {
    return currencyA.equals(currencyB)
  } else if (currencyA instanceof Currency) {
    return false
  } else if (currencyB instanceof Currency) {
    return false
  } else {
    return currencyA === currencyB
  }
}
