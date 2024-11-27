import { normalizeSuiAddress } from '@mysten/sui/utils'
import invariant from 'tiny-invariant'
import { formatCoinAddress } from './utils'

export const ZERO_ADDRESS = '0x2::sui::SUI'

export const _SUI_COIN_OBJECT_ID: { [key: string]: string } = {
  devnet: '0x0ca637f36954987daafba2e1866a51496df770383f72693658feb1f2438898e7',
  testnet: '0x587c29de216efd4219573e08a1f6964d4fa7cb714518c2c8a0f29abfa264327d',
  mainnet: '0x9258181f5ceac8dbffb7030890243caed69a9599d2886d957a9cb7656af3bdb3'
}
export const SUI_COIN_OBJECT_ID = _SUI_COIN_OBJECT_ID[process.env.NEXT_PUBLIC_ENVIRONMENT || 'mainnet']

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
    invariant(decimals >= 0 && decimals <= 255, 'DECIMALS ERROR')
    const { address: coinAddress, module, type } = formatCoinAddress(address)
    invariant(module && type, `${address} is not a valid Address.`)
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
