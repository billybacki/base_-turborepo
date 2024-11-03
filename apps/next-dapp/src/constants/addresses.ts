import { SupportedChainId } from './chains'
import { constructSameAddressMap } from 'utils/constructSameAddressMap'

type AddressMap = { [chainId: number]: string }

export const MULTICALL_ADDRESS: AddressMap = {
  ...constructSameAddressMap('0x1F98415757620B543A52E61c46B32eB19261F984'),
  [SupportedChainId.SEPOLIA]: '0x763892796cbB8BF635BbB1143bdF9CF4A6DA6ce8'
}

export const ENS_REGISTRAR_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
}
