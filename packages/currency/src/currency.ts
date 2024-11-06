import invariant from 'tiny-invariant'
import { validateAndParseEVMAddress } from './utils'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export class Currency {
  public readonly chainId: number
  public readonly address: string
  public readonly decimals: number
  public readonly symbol?: string
  public readonly name?: string
  public readonly logo?: string

  private static readonly defaultETHER: Currency = new Currency(1, ZERO_ADDRESS, 18, '', '')

  constructor(chainId: number, address: string, decimals: number, symbol?: string, name?: string, logo?: string) {
    invariant(decimals >= 0 && decimals <= 255, 'DECIMALS ERROR')

    this.chainId = chainId
    this.address = validateAndParseEVMAddress(address)
    this.decimals = decimals
    this.symbol = symbol
    this.name = name
    this.logo = logo
  }

  public equals(other: Currency): boolean {
    if (this === other) return true
    return this.chainId === other.chainId && this.address === other.address
  }

  public static getNativeCurrency(chainId?: number, decimals?: number, symbol?: string, name?: string, logo?: string) {
    if (!chainId) return this.defaultETHER
    return new Currency(chainId, ZERO_ADDRESS, decimals ?? 18, symbol, name, logo)
  }

  public get isNative(): boolean {
    return this.address === ZERO_ADDRESS
  }

  public sortsBefore(other: Currency): boolean {
    invariant(this.chainId === other.chainId, 'CHAIN_IDS')
    invariant(this.address !== other.address, 'ADDRESSES')
    return this.address.toLowerCase() < other.address.toLowerCase()
  }
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
