import React, { createContext, useContext, ReactNode } from 'react'

interface EvmWalletContextType {
  supportedChainIds: number[]
}

const EvmWalletContext = createContext<EvmWalletContextType>({
  supportedChainIds: []
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
}

export const EvmWalletProvider = ({ children, supportedChainIds }: EvmWalletProviderProps) => {
  return <EvmWalletContext.Provider value={{ supportedChainIds }}>{children}</EvmWalletContext.Provider>
}
