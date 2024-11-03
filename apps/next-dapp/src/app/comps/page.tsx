'use client'
import { Button, Container, Typography } from '@mui/material'
import BasicDateTimePicker from 'components/DatePicker'
import { DialogControl, globalDialogControl } from 'components/Dialog'
import BaseDialog from 'components/Dialog/baseDialog'
import { useState } from 'react'
import { useUpdateThemeMode } from 'state/application/hooks'

const textModalControl = new DialogControl({ TextModal })

function TextModal({ _state }: { _state: number }) {
  const [state, setState] = useState(_state ?? 0)
  return (
    <BaseDialog>
      <Typography sx={{ color: 'var(--ps-white)' }}>{state}</Typography>
      <Button onClick={() => setState(state + 1)}>set state</Button>
      <Button onClick={() => textModalControl.hide('TextModal')}>hide</Button>
      <Button onClick={() => textModalControl.remove('TextModal')}> remove</Button>
    </BaseDialog>
  )
}

function ShowModal() {
  return (
    <div>
      <Button
        onClick={() =>
          textModalControl.show('TextModal', { _state: 11 }).then(() => {
            console.log('show')
          })
        }
      >
        show modal
      </Button>
    </div>
  )
}
export default function Comps() {
  const { toggleThemeMode } = useUpdateThemeMode()
  return (
    <Container maxWidth="lg">
      <Button variant={'outlined'} onClick={() => toggleThemeMode()}>
        <span>toggle theme</span>
      </Button>
      <ShowModal />
      <BasicDateTimePicker />
      <Button onClick={() => globalDialogControl.show('SelectTokenDialog')}>show token list dialog</Button>
    </Container>
  )
}
