'use client'

import GoogleAnalyticsReporter from 'components/analytics/GoogleAnalyticsReporter'
import MuiThemeProvider from 'provider/MuiThemeProvider'
import ConnectProvider from 'provider/ConnectProvider'
import StateProvider from 'provider/StateProvider'
import { ModalProvider } from 'provider/ModalProvider'
import ApplicationUpdater from 'state/application/updater'
import TransactionsUpdater from 'state/transactions/updater'
import { MulticallUpdater } from 'state/multicall'
import BigNumber from 'bignumber.js'
import Popups from 'components/essential/Popups'
import 'styles/globals.css'
import NiceModal from '@ebay/nice-modal-react'
import { ReactNode } from 'react'

BigNumber.config({ EXPONENTIAL_AT: [-20, 40], ROUNDING_MODE: BigNumber.ROUND_DOWN })

function Updater() {
  return (
    <>
      <ApplicationUpdater />
      <MulticallUpdater />
      <TransactionsUpdater />
    </>
  )
}

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <StateProvider>
      <ConnectProvider>
        <MuiThemeProvider>
          <NiceModal.Provider>
            <Updater />
            <Popups />
            <GoogleAnalyticsReporter />
            <ModalProvider>{children}</ModalProvider>
          </NiceModal.Provider>
        </MuiThemeProvider>
      </ConnectProvider>
    </StateProvider>
  )
}
