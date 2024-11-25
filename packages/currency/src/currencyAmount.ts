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

  constructor(currency: Currency, amount: BigNumber | string | number | bigint) {
    this.currency = currency
    const _amount = new BigNumber(amount.toString())
    invariant(_amount.isInteger() && _amount.gte(0), 'Amount must be a positive integer')
    this.value = new BigNumber(amount.toString())
  }

  /**
   * Returns the raw BigNumber value
   */
  public get raw(): BigNumber {
    return this.value
  }

  public toBigint(): bigint {
    return BigInt(this.value.toString())
  }

  /**
   * Adds another CurrencyAmount to this one
   * @param other The CurrencyAmount to add
   * @throws If currencies are not the same
   * @returns A new CurrencyAmount
   */
  public add(other: CurrencyAmount): CurrencyAmount {
    invariant(this.currency.equals(other.currency), 'TOKEN')
    return new CurrencyAmount(this.currency, this.value.plus(other.value))
  }

  /**
   * Subtracts another CurrencyAmount from this one
   * @param other The CurrencyAmount to subtract
   * @throws If currencies are not the same or if result would be negative
   * @returns A new CurrencyAmount
   */
  public subtract(other: CurrencyAmount): CurrencyAmount {
    invariant(this.currency.equals(other.currency), 'TOKEN')
    const _val = this.value.minus(other.value)
    invariant(_val.gte(0), 'The result is negative')
    return new CurrencyAmount(this.currency, _val)
  }

  /**
   * Multiplies this CurrencyAmount by a value
   * @param other The value to multiply by (CurrencyAmount, BigNumber, string, or number)
   * @returns A new CurrencyAmount
   */
  public multiply(other: CurrencyAmount | BigNumber | string | number): CurrencyAmount {
    const multiplier = other instanceof CurrencyAmount ? other.value : new BigNumber(other)
    return new CurrencyAmount(this.currency, this.value.multipliedBy(multiplier).integerValue(BigNumber.ROUND_DOWN))
  }

  /**
   * Divides this CurrencyAmount by a value
   * @param other The value to divide by (CurrencyAmount, BigNumber, string, or number)
   * @throws If divisor is zero
   * @returns A new CurrencyAmount
   */
  public divide(other: CurrencyAmount | BigNumber | string | number): CurrencyAmount {
    const divisor = other instanceof CurrencyAmount ? other.value : new BigNumber(other)
    invariant(!divisor.isZero(), 'The division cannot be zero')
    return new CurrencyAmount(this.currency, this.value.dividedBy(divisor).integerValue(BigNumber.ROUND_DOWN))
  }

  /**
   * Formats the amount to a human-readable string with specified decimal places
   * @param decimalPlaces Number of decimal places to show (default: 2)
   * @param minimumThreshold Optional minimum threshold for display
   * @returns Formatted string representation
   */
  public toFormat(decimalPlaces = 2, minimumThreshold?: number): string {
    let value = this.readableValue.toFormat(decimalPlaces, {
      decimalSeparator: '.',
      groupSeparator: ',',
      groupSize: 3,
      secondaryGroupSize: 0,
      fractionGroupSeparator: ' ',
      fractionGroupSize: 0
    })

    if (value.includes('.')) {
      value = value.replace(/\.?0+$/, '')
    }

    if (minimumThreshold && this.value.gt(0) && this.readableValue.lt(minimumThreshold)) {
      return `<${minimumThreshold}`
    }
    return value
  }

  /**
   * Returns the amount as a fixed-point string
   * @param decimalPlaces Number of decimal places (default: 0)
   * @throws If decimal places exceed currency decimals
   * @returns Fixed-point string representation
   */
  public toFixed(decimalPlaces = 0): string {
    invariant(decimalPlaces <= this.currency.decimals, 'DECIMALS')
    return this.readableValue.toFixed(decimalPlaces, BigNumber.ROUND_DOWN)
  }

  /**
   * Converts raw value to human readable value by dividing by 10^decimals
   */
  private get readableValue(): BigNumber {
    const divisor = new BigNumber(10).pow(this.currency.decimals)
    return this.value.dividedBy(divisor)
  }

  /**
   * Returns the exact string representation of the amount
   */
  public toExact(): string {
    return this.readableValue.toString()
  }

  /**
   * Creates a new CurrencyAmount from a raw amount
   * @param currency The currency
   * @param amount The raw amount
   * @returns A new CurrencyAmount instance
   */
  public static fromRawAmount(currency: Currency, amount: string | number | bigint): CurrencyAmount {
    return new CurrencyAmount(currency, amount)
  }

  /**
   * Creates a new CurrencyAmount from a human readable amount
   * @param currency The currency
   * @param amount The human readable amount
   * @returns A new CurrencyAmount instance or undefined if parsing fails
   */
  public static fromAmount(currency: Currency, amount: string | number): CurrencyAmount | undefined {
    try {
      return new CurrencyAmount(currency, parseAmount(amount.toString(), currency.decimals))
    } catch (error) {
      console.debug(`Failed to parse input amount: "${amount}"`, error)
      return undefined
    }
  }

  public lessThan(other: CurrencyAmount): boolean {
    return this.value.lt(other.value)
  }

  public greaterThan(other: CurrencyAmount): boolean {
    return this.value.gt(other.value)
  }

  public equals(other: CurrencyAmount): boolean {
    return this.value.eq(other.value)
  }

  public isZero(): boolean {
    return this.value.isZero()
  }
}
