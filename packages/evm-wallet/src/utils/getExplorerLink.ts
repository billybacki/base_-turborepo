import { type Chain } from 'wagmi/chains'
import { chains } from '../constants'

type ExplorerDataType = 'transaction' | 'token' | 'address' | 'block'

const chainMap = new Map<number, Chain>(chains.map(chain => [chain.id, chain]))

export function getChainById(chainId: number): Chain | undefined {
  return chainMap.get(chainId)
}

export function getExplorerLink(chainId: number, data: string, type: ExplorerDataType): string {
  const chain = getChainById(chainId)
  if (!chain) return ''
  const blockExplorer = chain.blockExplorers?.default
  if (!blockExplorer) return ''

  const baseUrl = blockExplorer.url
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl

  switch (type) {
    case 'transaction':
      return `${base}/tx/${data}`
    case 'token':
      if (chain.id === 1666600000) {
        // Harmony
        return `${base}/address/${data}`
      }
      if (chain.id === 66) {
        // OKEx
        return `${base}/tokenAddr/${data}`
      }
      if ([100, 43114, 1285, 122, 1284, 2222].includes(chain.id)) {
        // Blockscout
        return `${base}/tokens/${data}`
      }
      if (chain.id === 40) {
        // Telos
        return `${base}/address/${data}`
      }
      return `${base}/token/${data}`
    case 'address':
      return `${base}/address/${data}`
    case 'block':
      if (chain.id === 40) {
        // Telos
        return `${base}/block/${data}`
      }
      return `${base}/block/${data}`
    default:
      return baseUrl
  }
}
