import { getFullnodeUrl } from '@mysten/sui/client'
import JSBI from 'jsbi'

export const networks = {
  devnet: { url: getFullnodeUrl('devnet') },
  testnet: { url: 'https://sui-testnet.blastapi.io/9eeac766-e3aa-4e66-be75-6080764da085' },
  mainnet: { url: getFullnodeUrl('mainnet') }
}

export const SUI_COIN = '0x2::sui::SUI'

export const _SUI_COIN_OBJECT_ID: { [key: string]: string } = {
  devnet: '0x0ca637f36954987daafba2e1866a51496df770383f72693658feb1f2438898e7',
  testnet: '0x587c29de216efd4219573e08a1f6964d4fa7cb714518c2c8a0f29abfa264327d',
  mainnet: '0x9258181f5ceac8dbffb7030890243caed69a9599d2886d957a9cb7656af3bdb3'
}
export const SUI_COIN_OBJECT_ID = _SUI_COIN_OBJECT_ID[process.env.NEXT_PUBLIC_ENVIRONMENT || 'mainnet']

export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256'
}

export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const TEN = JSBI.BigInt(10)

export type BigintIsh = JSBI | bigint | string

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP
}
