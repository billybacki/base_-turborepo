import { useConfig, useReadContracts } from 'wagmi'
import { Address, erc20Abi } from 'viem'
import { useCallback, useMemo } from 'react'
import { Config, getBalance } from '@wagmi/core'
import { useQuery } from '@tanstack/react-query'
import { Currency, CurrencyAmount } from '@repo/currency'

/**
 * Hook to fetch ERC20 token basic information
 * @param address Token contract address
 * @param chainId Chain ID
 * @returns Token instance and loading error state
 */
export function useToken(address: Address, chainId: number) {
  const { data, isLoading, isError } = useReadContracts({
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

  return { token, isLoading, isError }
}

/**
 * Hook to fetch single currency balance
 * @param account User account address
 * @param currency Currency instance
 * @returns CurrencyAmount instance
 */
export function useCurrencyBalance(account: string, currency: Currency | undefined) {
  const { balances, refetchBalances, isLoading } = useCurrencyBalances(account, [currency])
  return { balances: balances[0], refetchBalances, isLoading }
}

/**
 * Hook to fetch multiple currency balances
 * @param account User account address
 * @param currencies Array of Currency instances
 * @returns Object containing balances array and loading state
 */
export function useCurrencyBalances(account: string, currencies: (Currency | undefined)[]) {
  const wagmiConfig = useConfig() as Config

  const tokens = useMemo(() => currencies.filter(currency => currency && !currency?.isNative), [currencies])
  const {
    data: tokensBalances,
    isLoading: isLoadingCurrencyBalances,
    refetch
  } = useReadContracts({
    allowFailure: true,
    contracts: tokens.map(currency => ({
      address: currency?.isNative ? undefined : currency?.address,
      abi: erc20Abi,
      chainId: currency?.chainId,
      functionName: 'balanceOf',
      args: [account as Address]
    })),
    query: {
      enabled: !!account && !!tokens,
      refetchInterval: 10_000
    }
  })
  const currencyBalanceMaps = useMemo(() => {
    return tokens?.reduce<Record<string, string>>((memo, token, i) => {
      const value = tokensBalances?.[i]?.result?.toString()
      if (value && token?.address) memo[token.address + token.chainId] = value
      return memo
    }, {})
  }, [tokens, tokensBalances])

  const nativeCurrencies = useMemo(() => currencies.filter(currency => currency?.isNative), [currencies])

  const {
    data: nativeCurrencyBalances,
    isLoading: isLoadingNativeCurrencyBalance,
    refetch: refetchNative
  } = useQuery({
    queryKey: ['nativeCurrencyBalances', account, nativeCurrencies.map(currency => currency?.chainId)],
    queryFn: async () => {
      const balances = await Promise.all(
        nativeCurrencies.map(async currency => {
          if (!currency) return undefined
          const balance = await getBalance(wagmiConfig, { address: account as Address, chainId: currency.chainId })
          return balance.value
        })
      )
      return balances
    },
    enabled: !!account && !!nativeCurrencies && !!wagmiConfig,
    refetchInterval: 10_000
  })

  const balances = useMemo(() => {
    let nativeIndex = 0
    return currencies?.map(currency => {
      if (!currency) return undefined
      if (currency.isNative) {
        const value = nativeCurrencyBalances?.[nativeIndex]
        nativeIndex++
        return value ? CurrencyAmount.fromRawAmount(currency, value) : undefined
      }
      const bal = currencyBalanceMaps?.[currency.address + currency.chainId]
      return bal ? CurrencyAmount.fromRawAmount(currency, bal) : undefined
    })
  }, [currencies, currencyBalanceMaps, nativeCurrencyBalances])

  const refetchBalances = useCallback(() => {
    refetch()
    refetchNative()
  }, [refetch, refetchNative])

  return { balances, isLoading: isLoadingCurrencyBalances || isLoadingNativeCurrencyBalance, refetchBalances }
}
