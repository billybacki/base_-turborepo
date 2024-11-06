import BigNumber from 'bignumber.js'
import invariant from 'tiny-invariant'
import { Currency } from './currency'
import { parseAmount } from './utils'

BigNumber.config({
  DECIMAL_PLACES: 18,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
  EXPONENTIAL_AT: [-20, 40],
  CRYPTO: true,
  POW_PRECISION: 100
})

export class CurrencyAmount {
  public readonly currency: Currency
  private readonly value: BigNumber

  constructor(currency: Currency, amount: BigNumber | string | number) {
    this.currency = currency
    this.value = new BigNumber(amount)
  }

  public get raw(): BigNumber {
    return this.value
  }

  public add(other: CurrencyAmount): CurrencyAmount {
    invariant(this.currency.equals(other.currency), 'TOKEN')
    return new CurrencyAmount(this.currency, this.value.plus(other.value))
  }

  public subtract(other: CurrencyAmount): CurrencyAmount {
    invariant(this.currency.equals(other.currency), 'TOKEN')
    return new CurrencyAmount(this.currency, this.value.minus(other.value))
  }

  public multiply(other: CurrencyAmount | BigNumber | string | number): CurrencyAmount {
    const multiplier = other instanceof CurrencyAmount ? other.value : new BigNumber(other)
    return new CurrencyAmount(this.currency, this.value.multipliedBy(multiplier))
  }

  public divide(other: CurrencyAmount | BigNumber | string | number): CurrencyAmount {
    const divisor = other instanceof CurrencyAmount ? other.value : new BigNumber(other)
    invariant(!divisor.isZero(), 'The division cannot be zero')
    return new CurrencyAmount(this.currency, this.value.dividedBy(divisor))
  }

  public toSignificant(significantDigits = 6, format: Record<string, unknown> = { groupSeparator: ',' }): string {
    return this.value.toFormat(significantDigits, format)
  }

  public toFixed(
    decimalPlaces: number = this.currency.decimals,
    format?: Record<string, unknown>,
    rounding = BigNumber.ROUND_DOWN
  ): string {
    invariant(decimalPlaces <= this.currency.decimals, 'DECIMALS')
    return this.value.toFormat(decimalPlaces, rounding, format)
  }

  public toExact(format: Record<string, unknown> = { groupSeparator: '' }): string {
    return this.value.toFormat(this.currency.decimals, format)
  }

  public static fromRawAmount(currency: Currency, amount: string | number): CurrencyAmount {
    return new CurrencyAmount(currency, amount)
  }

  public static fromAmount(currency: Currency, amount: string | number): CurrencyAmount | undefined {
    try {
      return new CurrencyAmount(currency, parseAmount(amount.toString(), currency.decimals))
    } catch (error) {
      console.debug(`Failed to parse input amount: "${amount}"`, error)
      return undefined
    }
  }
}
