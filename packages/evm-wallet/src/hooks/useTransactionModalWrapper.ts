import { useTransactionModal } from '@repo/material-ui'
import { useWaitForTransactionReceiptCallback } from './contract/useAsyncContractCallback'
import { TransactionReceipt } from 'viem'
import { getExplorerLink } from '../utils/getExplorerLink'
import { useEvmWallet } from './useWallet'

export function useTransactionModalWrapper<T extends any[]>(
  event: (...args: T) => Promise<`0x${string}`>,
  option?: {
    isApprove?: boolean
    hideSuccessTip?: boolean
    successTipsTitle?: string
    successTipsText?: string
    onSuccess?: () => void
    modalSuccessCancel?: (hash?: string) => void
    modalSuccessClose?: () => void
  }
) {
  const { open } = useTransactionModal()
  const { chainId } = useEvmWallet()
  const waitForTransactionReceiptCallback = useWaitForTransactionReceiptCallback()

  const handleTransaction = async (...args: T) => {
    try {
      open({
        title: option?.isApprove ? 'Requesting Wallet Approval' : 'Requests wallet interaction',
        subTitle: option?.isApprove
          ? 'Please manually approve the transaction in your wallet.'
          : 'Please open your wallet and confirm in the transaction activity to proceed your order.',
        status: 'pending'
      })

      const hash = await event(...args)

      const output = await new Promise<TransactionReceipt>((resolve, reject) => {
        open({
          title: 'Waiting for Transaction Settlement',
          subTitle: 'Please wait for the transaction to be settled on-chain.',
          status: 'pending',
          link: getExplorerLink(chainId, hash, 'transaction'),
          onClose: () => reject('user cancel')
        })

        waitForTransactionReceiptCallback(hash as `0x${string}`)
          .then(receipt => {
            resolve(receipt)
          })
          .catch(err => {
            reject(err)
          })
      })

      const transactionReceipt = await output

      if (transactionReceipt.status !== 'success') {
        throw 'Transaction failed'
      }

      !option?.hideSuccessTip &&
        open({
          status: 'success',
          title: option?.successTipsTitle || 'Congratulations!',
          link: getExplorerLink(chainId, hash, 'transaction'),
          subTitle: option?.successTipsText || `The transaction has been successfully confirmed`,
          onClose: option?.modalSuccessCancel && (() => option?.modalSuccessCancel?.(hash)),
          onSuccessClose: option?.modalSuccessClose
        })

      option?.onSuccess?.()
      return output
    } catch (err: any) {
      if (err === 'user cancel') throw err
      let errMsg =
        err?.reason ||
        err?.error?.message ||
        err?.data?.message ||
        err?.message ||
        err?.toString() ||
        'Something went wrong'

      if (errMsg.includes('User rejected the request')) errMsg = 'User rejected the request'

      open({
        title: 'Oops..',
        subTitle: errMsg,
        status: 'error',
        retryFunc: () => handleTransaction(...args)
      })
      throw err
    }
  }

  return handleTransaction
}
