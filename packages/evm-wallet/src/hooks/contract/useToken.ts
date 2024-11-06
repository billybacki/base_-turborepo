import { useReadContracts } from 'wagmi'
import { Address, erc20Abi } from 'viem'

export function useToken(address: Address, chainId: number) {
  const { data, isLoading } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address,
        abi: erc20Abi,
        chainId,
        functionName: 'symbol'
      },
      {
        address,
        abi: erc20Abi,
        chainId,
        functionName: 'name'
      },
      {
        address,
        abi: erc20Abi,
        chainId,
        functionName: 'decimals'
      }
    ],
    query: {
      enabled: !!address && !!chainId
    }
  })

  return { data, isLoading }
}
