'use client'
import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react'

interface DialogState {
  [key: string]: {
    open: boolean
    propsObject?: any
  }
}

type DialogAction = { type: 'OPEN'; id: string; propsObject: any } | { type: 'CLOSE'; id: string }

const DialogContext = createContext<{
  state: DialogState
  openDialog: (id: string, propsObject?: any) => void
  closeDialog: (id: string) => void
} | null>(null)

function dialogReducer(state: DialogState, action: DialogAction): DialogState {
  switch (action.type) {
    case 'OPEN':
      return {
        ...state,
        [action.id]: { open: true, propsObject: action.propsObject }
      }
    case 'CLOSE':
      return {
        ...state,
        [action.id]: { ...state[action.id], open: false }
      }
    default:
      return state
  }
}

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dialogReducer, {})

  const openDialog = useCallback((id: string, propsObject?: any) => {
    dispatch({ type: 'OPEN', id, propsObject })
  }, [])

  const closeDialog = useCallback((id: string) => {
    dispatch({ type: 'CLOSE', id })
  }, [])

  const value = useMemo(() => ({ state, openDialog, closeDialog }), [state, openDialog, closeDialog])

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
}

export const useDialog = () => {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('useDialog must be used within DialogProvider')
  }
  return context
}

export function useDialogState<T = any>(dialogId?: string) {
  const [dialogIdByUse] = React.useState(dialogId || Math.random().toString(36).substring(2, 15))
  const { openDialog, closeDialog, state } = useDialog()

  return {
    open: (propsObject?: T) => openDialog(dialogIdByUse, propsObject),
    close: () => closeDialog(dialogIdByUse),
    isOpen: Boolean(state[dialogIdByUse]?.open),
    propsObject: state[dialogIdByUse]?.propsObject as T
  }
}
