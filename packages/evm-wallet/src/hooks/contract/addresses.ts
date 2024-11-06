import { ContractAddressesMapType, ContractAddressesType } from './types'

enum chainId {
  ETHEREUM = 1,
  BSC = 56
}

type ContractName = 'USDT'

const USDT: ContractAddressesType<chainId> = {
  [chainId.ETHEREUM]: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  [chainId.BSC]: '0x55d398326f99059fF775485246999027B3197955'
}

export const internalContractAddresses: ContractAddressesMapType<ContractName, chainId> = {
  USDT
}
