import { Checkbox as MuiCheckbox, FormControlLabel } from '@mui/material'
import CheckboxIcon from '../../assets/svg/checkbox.svg'
import CheckboxCheckedIcon from '../../assets/svg/checkbox_checked.svg'

interface Props {
  checked: boolean
  onChange?: () => void
  label?: string
  disabled?: boolean
}

export default function Checkbox(props: Props) {
  const { checked, onChange, label = '', disabled } = props
  return (
    <FormControlLabel
      sx={{ margin: 0, fontSize: 16, fontWeight: 400 }}
      control={
        <MuiCheckbox
          sx={{ padding: 0, marginRight: '12px' }}
          icon={<CheckboxIcon />}
          checkedIcon={<CheckboxCheckedIcon />}
        />
      }
      label={label}
      labelPlacement="end"
      onChange={onChange}
      checked={checked}
      disabled={disabled}
    />
  )
}
