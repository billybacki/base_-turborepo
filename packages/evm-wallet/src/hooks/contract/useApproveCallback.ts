import { Currency, CurrencyAmount } from '@repo/currency'
import { Address, erc20Abi, maxUint256 } from 'viem'
import { useEvmWallet } from '../useWallet'
import { useCallback, useMemo } from 'react'
import { useTokenAllowance } from './useTokenAllowance'
import { useWriteContract } from 'wagmi'
import { useSimulateContractCallback } from './useAsyncContractCallback'
import { useTransactionModalWrapper } from '../useTransactionModalWrapper'
import { useAddRecentTransaction, useTransactionState } from '../transactions/hooks'

type ApprovalState = 'UNKNOWN' | 'NOT_APPROVED' | 'PENDING' | 'APPROVED'

export function useApproveCallback(amountToApprove?: CurrencyAmount<Currency>, spender?: Address, useExact?: boolean) {
  const { account } = useEvmWallet()
  const simulateContractCallback = useSimulateContractCallback()
  const isNative = useMemo(() => !!amountToApprove?.currency?.isNative, [amountToApprove?.currency?.isNative])
  const addRecentTransaction = useAddRecentTransaction()
  const { writeContractAsync } = useWriteContract()

  const currentAllowance = useTokenAllowance(amountToApprove?.currency, account ?? undefined, spender)

  const { pending } = useTransactionState(`approve_${amountToApprove?.currency.address}`)

  const approvalState: ApprovalState = useMemo(() => {
    if (!currentAllowance.data || !amountToApprove) return 'UNKNOWN'
    if (pending) return 'PENDING'
    if (currentAllowance.data.lessThan(amountToApprove)) return 'NOT_APPROVED'
    return 'APPROVED'
  }, [currentAllowance, pending, amountToApprove])

  const approve = useCallback(async () => {
    if (!writeContractAsync || !amountToApprove || !spender || !account || isNative) throw new Error('Invalid params')
    if (approvalState !== 'NOT_APPROVED') throw new Error('Already approved')
    try {
      // TOTD usdt is bug
      const result = await simulateContractCallback({
        address: amountToApprove.currency.address,
        abi: erc20Abi,
        functionName: 'approve',
        args: [spender, useExact ? amountToApprove.toBigint() : maxUint256],
        account
      })

      const hash = await writeContractAsync(result.request)

      addRecentTransaction(
        `Approve ${amountToApprove.currency.symbol}`,
        hash,
        `approve_${amountToApprove.currency.address}`
      )

      return hash
    } catch (error) {
      console.error('aaaaa' + error)
      throw error
    }
  }, [
    writeContractAsync,
    amountToApprove,
    spender,
    account,
    isNative,
    approvalState,
    simulateContractCallback,
    useExact,
    addRecentTransaction
  ])

  const approveWithModal = useTransactionModalWrapper(approve)

  return { approvalState, approve, approveWithModal }
}
