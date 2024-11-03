import React, { createContext, useContext, ReactNode } from 'react'

interface EvmWalletContextType {
  supportedChainIds: number[]
}

const EvmWalletContext = createContext<EvmWalletContextType>({
  supportedChainIds: []
})

export const useEvmWalletContext = () => useContext(EvmWalletContext)

interface EvmWalletProviderProps {
  children: ReactNode
  supportedChainIds: number[]
}

export const EvmWalletProvider = ({ children, supportedChainIds }: EvmWalletProviderProps) => {
  return <EvmWalletContext.Provider value={{ supportedChainIds }}>{children}</EvmWalletContext.Provider>
}
