import JSBI from 'jsbi'
import { normalizeSuiAddress } from '@mysten/sui/utils'
import invariant from 'tiny-invariant'
import { SolidityType, SUI_COIN, SUI_COIN_OBJECT_ID } from '.'
import { formatCoinAddress, validateSolidityTypeInstance } from '../utils'

export const ZERO_ADDRESS = SUI_COIN

export class Currency {
  public readonly address: string
  public readonly decimals: number
  public readonly symbol?: string
  public readonly name?: string
  public readonly id: string
  public logo?: string
  public readonly description?: string
  // private static readonly defaultETHER: Currency = new Currency(ZERO_ADDRESS, 9, 'TON')
  /**
   * Constructs an instance of the base class `Currency`.
   * @param decimals decimals of the currency
   * @param symbol symbol of the currency
   * @param name of the currency
   */
  constructor(
    address: string,
    id: string,
    decimals: number,
    symbol?: string,
    name?: string,
    logo?: string,
    description?: string
  ) {
    validateSolidityTypeInstance(JSBI.BigInt(decimals), SolidityType.uint8)
    const { address: coinAddress, module, type } = formatCoinAddress(address)
    invariant(module && type, `${address} is not a Address.`)
    this.address = coinAddress
    this.id = id
    this.decimals = decimals
    this.symbol = symbol
    this.name = name
    this.logo = logo
    this.description = description
  }

  public static getNativeCurrency(decimals?: number) {
    return new Currency(
      ZERO_ADDRESS,
      SUI_COIN_OBJECT_ID || '',
      decimals ? decimals : 9,
      'Sui',
      'Sui',
      'https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png'
    )
  }

  public equals(other: Currency): boolean {
    // short circuit on reference equality
    if (this === other) {
      return true
    }
    return this.address === other.address
  }

  public get isNative() {
    return this.address === normalizeSuiAddress(ZERO_ADDRESS)
  }

  public setLogo(logo: string) {
    this.logo = logo
  }
}
