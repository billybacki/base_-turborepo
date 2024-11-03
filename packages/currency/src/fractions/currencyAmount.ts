import { parseUnits } from '@ethersproject/units'
import { Currency } from '../currency'
import invariant from 'tiny-invariant'
import JSBI from 'jsbi'
import _Big from 'big.js'
import toFormat from 'toformat'
import { Fraction } from './fraction'
import { BigintIsh, Rounding, SolidityType, TEN } from '../constants'
import { parseBigintIsh, validateSolidityTypeInstance } from '../utils'
import BigNumber from 'bignumber.js'
import { currencyEquals } from '../token'

export function tryParseAmount(value?: string, currency?: Currency): CurrencyAmount | undefined {
  if (!value || !currency) {
    return undefined
  }
  try {
    const str = value.split('.')
    if (str.length === 2) {
      value = `${str[0]}.${str[1]!.slice(0, currency.decimals)}`
    }
    const typedValueParsed = parseUnits(value, currency.decimals).toString()
    if (typedValueParsed !== '0') {
      return new CurrencyAmount(currency, JSBI.BigInt(typedValueParsed))
      // return currency instanceof Currency
      //   ? new CurrencyAmount(currency, JSBI.BigInt(typedValueParsed))
      //   : CurrencyAmount.ether(JSBI.BigInt(typedValueParsed))
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
  // necessary for all paths to return a value
  return undefined
}

const Big = toFormat(_Big)

export class CurrencyAmount extends Fraction {
  public currency: Currency

  /**
   * ！Deprecated method, do not use
   * Helper that calls the constructor with the ETHER currency
   * @param amount ether amount in wei
   */
  public static ether(amount: BigintIsh, chainId?: number): CurrencyAmount {
    return new CurrencyAmount(Currency.getNativeCurrency(chainId), amount)
  }

  // amount _must_ be raw, i.e. in the native representation
  constructor(currency: Currency, amount: BigintIsh) {
    const parsedAmount = parseBigintIsh(amount)
    validateSolidityTypeInstance(parsedAmount, SolidityType.uint256)

    super(parsedAmount, JSBI.exponentiate(TEN, JSBI.BigInt(currency.decimals)))
    this.currency = currency
  }

  public get raw(): JSBI {
    return this.numerator
  }

  public add(other: CurrencyAmount): CurrencyAmount {
    invariant(currencyEquals(this.currency, other.currency), 'TOKEN')
    return new CurrencyAmount(this.currency, JSBI.add(this.raw, other.raw))
  }

  public subtract(other: CurrencyAmount): CurrencyAmount {
    invariant(currencyEquals(this.currency, other.currency), 'TOKEN')
    return new CurrencyAmount(this.currency, JSBI.subtract(this.raw, other.raw))
  }

  public toSignificant(
    significantDigits = 6,
    format: Record<string, unknown> = { groupSeparator: ',' },
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    return super.toSignificant(significantDigits, format, rounding)
  }

  public toFixed(
    decimalPlaces: number = this.currency.decimals,
    format?: Record<string, unknown>,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    invariant(decimalPlaces <= this.currency.decimals, 'DECIMALS')
    return super.toFixed(decimalPlaces, format, rounding)
  }

  public toExact(format: Record<string, unknown> = { groupSeparator: '' }): string {
    Big.DP = this.currency.decimals
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(format)
  }

  public mul(other: CurrencyAmount | JSBI | number | BigNumber): CurrencyAmount {
    const val = other instanceof CurrencyAmount ? other.toExact() : other instanceof JSBI ? other.toString() : other
    return CurrencyAmount.fromAmount(
      this.currency,
      new BigNumber(val).times(this.toExact()).toString()
    ) as CurrencyAmount
  }

  public div(other: CurrencyAmount | JSBI | number | BigNumber): CurrencyAmount {
    const val = other instanceof CurrencyAmount ? other.toExact() : other instanceof JSBI ? other.toString() : other
    return CurrencyAmount.fromAmount(this.currency, new BigNumber(this.toExact()).div(val).toString()) as CurrencyAmount
  }

  /**
   * Returns a new currency amount instance from the unitless amount of token, i.e. the raw amount
   * @param currency the currency in the amount
   * @param rawAmount the raw token or ether amount
   */
  public static fromRawAmount(currency: Currency, rawAmount: BigintIsh): CurrencyAmount {
    return new CurrencyAmount(currency, rawAmount)
  }

  /**
   * Returns a new currency amount instance from the user input amount of token
   * @param amount the raw token or ether amount
   * @param currency the currency in the amount
   */
  public static fromAmount(currency: Currency, amount: string | number): CurrencyAmount | undefined {
    return tryParseAmount(amount.toString(), currency)
  }
}
