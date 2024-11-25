import React, { createContext, useContext, ReactNode } from 'react'

interface EvmWalletContextType {
  supportedChainIds: number[]
  showTransactionNotification: boolean
}

const EvmWalletContext = createContext<EvmWalletContextType>({
  supportedChainIds: [],
  showTransactionNotification: true
})

export const useEvmWalletContext = () => {
  const context = useContext(EvmWalletContext)
  if (!context) {
    throw new Error('useEvmWalletContext must be used within a EvmWalletProvider')
  }
  return context
}

interface EvmWalletProviderProps {
  children: ReactNode
  supportedChainIds: number[]
  showTransactionNotification?: boolean
}

export const EvmWalletProvider = ({
  children,
  supportedChainIds,
  showTransactionNotification
}: EvmWalletProviderProps) => {
  return (
    <EvmWalletContext.Provider
      value={{ supportedChainIds, showTransactionNotification: showTransactionNotification ?? true }}
    >
      {children}
    </EvmWalletContext.Provider>
  )
}
