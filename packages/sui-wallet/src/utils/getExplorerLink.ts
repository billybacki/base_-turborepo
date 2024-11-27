export type NetworkEnvironmentType = 'devnet' | 'testnet' | 'mainnet'

function isTransactionHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash)
}

function isAddress(addr: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(addr)
}

export function getExplorerLink(network: NetworkEnvironmentType, data: string): string {
  const baseUrls: Record<NetworkEnvironmentType, string> = {
    devnet: 'https://devnet.suivision.xyz/',
    testnet: 'https://testnet.suivision.xyz/',
    mainnet: 'https://suivision.xyz'
  }
  const baseUrl = baseUrls[network]
  if (isTransactionHash(data)) {
    return `${baseUrl}/txBlock/${data}`
  } else if (isAddress(data)) {
    return `${baseUrl}/account/${data}`
  } else {
    throw new Error('Invalid tx hash or address')
  }
}
