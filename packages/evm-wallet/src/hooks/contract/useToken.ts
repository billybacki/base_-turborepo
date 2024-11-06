import { useReadContracts } from 'wagmi'
import { Address, erc20Abi } from 'viem'
import { Currency } from '@repo/currency'
import { useMemo } from 'react'

export function useToken(address: Address, chainId: number) {
  const { data, isLoading } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address,
        abi: erc20Abi,
        chainId,
        functionName: 'decimals'
      },
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
      }
    ],
    query: {
      enabled: !!address && !!chainId
    }
  })

  const token = useMemo(() => {
    if (!data) return undefined
    return new Currency(chainId, address, Number(data[0]), data[1], data[2])
  }, [address, chainId, data])

  return { token, isLoading }
}
