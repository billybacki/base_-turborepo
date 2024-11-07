import { useBalance, useReadContracts } from 'wagmi'
import { Address, erc20Abi } from 'viem'
import { Currency, CurrencyAmount } from '@repo/currency'
import { useMemo } from 'react'

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
  const { balances } = useCurrencyBalances(account, [currency])
  return balances[0]
}

/**
 * Hook to fetch multiple currency balances
 * @param account User account address
 * @param currencies Array of Currency instances
 * @returns Object containing balances array and loading state
 */
export function useCurrencyBalances(account: string, currencies: (Currency | undefined)[]) {
  const invalidChainId = useMemo(() => {
    const firstChainId = currencies.find(c => c)?.chainId
    return !firstChainId || currencies.some(c => c && c.chainId !== firstChainId)
  }, [currencies])

  const tokens = useMemo(() => currencies.filter(currency => currency && !currency?.isNative), [currencies])
  const { data: tokensBalances, isLoading: isLoadingCurrencyBalances } = useReadContracts({
    allowFailure: true,
    contracts: tokens.map(currency => ({
      address: currency?.isNative ? undefined : currency?.address,
      abi: erc20Abi,
      chainId: currency?.chainId,
      functionName: 'balanceOf',
      args: [account as Address]
    })),
    query: {
      enabled: (!!account && !!tokens) || !invalidChainId,
      refetchInterval: 10_000
    }
  })
  const currencyBalanceMaps = useMemo(() => {
    return tokens?.reduce<Record<string, string>>((memo, token, i) => {
      const value = tokensBalances?.[i]?.result?.toString()
      if (value && token?.address) memo[token.address] = value
      return memo
    }, {})
  }, [tokens, tokensBalances])

  const queryNativeCurrency = useMemo(() => currencies.find(currency => currency?.isNative), [currencies])

  const { data: nativeCurrencyBalance, isLoading: isLoadingNativeCurrencyBalance } = useBalance({
    address: account as Address,
    chainId: queryNativeCurrency?.chainId,
    query: {
      enabled: !!queryNativeCurrency,
      refetchInterval: 10_000
    }
  })

  const balances = useMemo(() => {
    return currencies?.map(currency => {
      if (!currency) return undefined
      const balance = currency.isNative
        ? nativeCurrencyBalance?.value.toString()
        : currencyBalanceMaps?.[currency.address]
      return balance ? CurrencyAmount.fromRawAmount(currency, balance) : undefined
    })
  }, [currencies, nativeCurrencyBalance?.value, currencyBalanceMaps])

  return { balances, isLoading: isLoadingCurrencyBalances || isLoadingNativeCurrencyBalance }
}
