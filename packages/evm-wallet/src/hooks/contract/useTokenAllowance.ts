import { Currency, CurrencyAmount } from '@repo/currency'
import { useMemo } from 'react'
import { Address, erc20Abi } from 'viem'
import { useReadContract } from 'wagmi'

export function useTokenAllowance(token?: Currency, owner?: Address, spender?: Address) {
  const isNative = useMemo(() => !!token?.isNative, [token?.isNative])

  const { data, isLoading, isError } = useReadContract({
    address: token?.address,
    chainId: token?.chainId,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [owner!, spender!],
    query: {
      enabled: !!owner && !!spender && !isNative,
      refetchInterval: 6_000
    }
  })

  const allowance = useMemo(() => (data && token ? new CurrencyAmount(token, data) : undefined), [data, token])

  return {
    data: allowance,
    isLoading,
    isError
  }
}
