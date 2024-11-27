import { useCurrentAccount } from '@mysten/dapp-kit'

export function useActiveWeb3React() {
  return useCurrentAccount()
}
