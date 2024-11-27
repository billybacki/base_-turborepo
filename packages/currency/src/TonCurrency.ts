import invariant from 'tiny-invariant'
import { validateAndParseEVMAddress } from './utils'
import { Address, zeroAddress } from 'viem'

export class TonCurrency {
  public readonly address: Address
  public readonly decimals: number
  public readonly symbol?: string
  public readonly name?: string
  public readonly logo?: string

  private static readonly defaultETHER: TonCurrency = new TonCurrency(zeroAddress, 18, '', '')

  constructor(address: Address, decimals: number, symbol?: string, name?: string, logo?: string) {
    invariant(decimals >= 0 && decimals <= 255, 'DECIMALS ERROR')

    this.address = validateAndParseEVMAddress(address)
    this.decimals = decimals
    this.symbol = symbol
    this.name = name
    this.logo = logo
  }

  public equals(other: any): boolean {
    if (this === other) return true

    return other instanceof TonCurrency && this.address === other.address
  }

  public static getNativeCurrency(chainId?: number, decimals?: number, symbol?: string, name?: string, logo?: string) {
    if (!chainId) return this.defaultETHER
    return new TonCurrency(zeroAddress, decimals ?? 18, symbol, name, logo)
  }

  public get isNative(): boolean {
    return this.address === zeroAddress
  }
}
