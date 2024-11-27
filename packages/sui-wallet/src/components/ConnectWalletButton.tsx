'use client'
import { ConnectButton, ConnectModal, useCurrentAccount } from '@mysten/dapp-kit'
import { useState } from 'react'

export function ConnectWalletButton() {
  return <ConnectButton />
}

export function ConnectWalletModal() {
  const currentAccount = useCurrentAccount()
  const [open, setOpen] = useState(false)

  return (
    <ConnectModal
      trigger={<button disabled={!!currentAccount}> {currentAccount ? 'Connected' : 'Connect Wallet'}</button>}
      open={open}
      onOpenChange={isOpen => setOpen(isOpen)}
    />
  )
}
