import { useTransactionModal } from '@repo/material-ui'
import { getExplorerLink, NetworkEnvironmentType } from '../utils/getExplorerLink'
import { useSuiClientMutation } from '@mysten/dapp-kit'

export function useTransactionModalWrapper<T extends any[]>(
  event: (...args: T) => Promise<{
    hash: string
  }>,
  option?: {
    hideSuccessTip?: boolean
    successTipsTitle?: string
    successTipsText?: string
    onSuccess?: () => void
    modalSuccessCancel?: (hash?: string) => void
    modalSuccessClose?: () => void
  }
) {
  const { open } = useTransactionModal()
  const { mutateAsync } = useSuiClientMutation('waitForTransaction')
  const handleTransaction = async (...args: T) => {
    try {
      open({
        title: 'Requests wallet interaction',
        subTitle: 'Please open your wallet and confirm in the transaction activity to proceed your order.',
        status: 'pending'
      })

      const { hash } = await event(...args)

      const output = await new Promise<any>((resolve, reject) => {
        open({
          title: 'Waiting for Transaction Settlement',
          subTitle: 'Please wait for the transaction to be settled on-chain.',
          status: 'pending',
          link: getExplorerLink((process.env.NEXT_PUBLIC_ENVIRONMENT as NetworkEnvironmentType) || 'mainnet', hash),
          onClose: () => reject('user cancel')
        })

        mutateAsync({ digest: hash })
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
          link: getExplorerLink((process.env.NEXT_PUBLIC_ENVIRONMENT as NetworkEnvironmentType) || 'mainnet', hash),
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
