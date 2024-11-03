import { defineChain } from 'viem'
import { sepolia, mainnet, Chain } from 'viem/chains'

export type ChainInfo = Chain

const lootChain = defineChain({
  id: 5151706,
  name: 'Loot Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'AGLD',
    symbol: 'AGLD'
  },
  rpcUrls: {
    alchemy: {
      http: ['https://rpc.lootchain.com/http']
    },
    infura: {
      http: ['https://rpc.lootchain.com/http']
    },
    default: {
      http: ['https://rpc.lootchain.com/http']
    },
    public: {
      http: ['https://rpc.lootchain.com/http']
    }
  },
  blockExplorers: {
    default: {
      name: 'loot',
      url: 'https://explorer.lootchain.com/'
    }
  }
})

export enum SupportedChainId {
  MAINNET = 1,
  SEPOLIA = 11155111,
  LOOT = 5151706
}

export const CHAINS: { [key in SupportedChainId]: ChainInfo } = {
  [SupportedChainId.MAINNET]: mainnet,
  [SupportedChainId.SEPOLIA]: sepolia,
  [SupportedChainId.LOOT]: lootChain
}

export const NETWORK_CHAIN_ID = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID) || SupportedChainId.MAINNET

export const SUPPORT_NETWORK_CHAIN_IDS: SupportedChainId[] = process.env.NEXT_PUBLIC_CHAIN_IDS
  ? process.env.NEXT_PUBLIC_CHAIN_IDS.split(',').map(v => Number(v) as SupportedChainId)
  : [SupportedChainId.MAINNET]

export const SupportedChainsInfo: { [x in SupportedChainId]: ChainInfo } = (() => {
  const list: { [x in SupportedChainId]: ChainInfo } = {} as { [x in SupportedChainId]: ChainInfo }
  for (const item of SUPPORT_NETWORK_CHAIN_IDS) {
    const chain = CHAINS[item]
    if (!chain) {
      throw new Error('Unsupported ChainId')
    }
    list[item] = chain
  }
  return list
})()

export const SupportedChainList = SUPPORT_NETWORK_CHAIN_IDS.map(chain => CHAINS[chain]).filter(i => i) as ChainInfo[]
