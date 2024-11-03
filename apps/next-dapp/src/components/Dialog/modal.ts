'use client'
import { DialogControl } from './DialogControl'
import PendingTipDialog from './components/PendingTipDialog'
import ResultTipDialog from './components/ResultTipDialog'
import SelectTokenDialog from './selectTokenDialog'

export const globalDialogControl = new DialogControl({
  PendingTipDialog,
  ResultTipDialog,
  SelectTokenDialog
})
