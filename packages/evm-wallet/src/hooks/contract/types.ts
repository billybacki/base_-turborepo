import { Address } from 'viem'

export type ContractAddressesType<K extends number = number> = { [key in K]: Address }

export type ContractAddressesMapType<T extends string = string, K extends number = number> = {
  [key in T]: ContractAddressesType<K>
}
