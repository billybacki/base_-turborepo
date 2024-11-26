'use client'
import { Box, Button, Container, Divider, Stack, Typography, styled } from '@mui/material'
import Input from 'components/Input'
import { SupportedChainId } from 'constants/chains'
import { Currency, CurrencyAmount } from 'constants/token'
import { useApproveCallback } from 'hooks/useApproveCallback'
import Head from 'next/head'
import { useUpdateThemeMode, useWalletModalToggle } from 'state/application/hooks'
import { MuiCustomThemeProvider } from 'provider/MuiThemeProvider'
import { useActiveWeb3React } from 'hooks'
import { shortenAddress } from 'utils'
import InputLabel from 'components/Input/InputLabel'
import CheckBox from 'components/Checkbox'

const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: 20,
  minHeight: '100vh'
}))

function ConnectButton() {
  const { account } = useActiveWeb3React()
  const walletModalToggle = useWalletModalToggle()

  // fix hydration err
  // const [isClient, setIsClient] = useState(false)
  // useEffect(() => {
  //   setIsClient(true)
  // }, [])

  return (
    <Stack>
      <Button
        variant={'outlined'}
        onClick={() => {
          walletModalToggle()
        }}
      >
        {<>{account ? shortenAddress(account) : 'wallet connect'}</>}
      </Button>
    </Stack>
  )
}

export default function Home() {
  const { toggleThemeMode } = useUpdateThemeMode()
  const [, run] = useApproveCallback(
    new CurrencyAmount(
      new Currency(SupportedChainId.SEPOLIA, '0x50cfe8075Ff70CBBe14b65D46a12AB71bCf79758', 18, 'ST'),
      '10000000000000000000'
    ),
    '0x5069129410122A4C1F2448c77becDc5A8A784a5D'
  )

  return (
    <>
      <Head>
        <title>Next base app</title>
      </Head>
      <StyledContainer maxWidth="md">
        <Box display={'grid'} justifyItems={'center'} gap={20}>
          <Button variant={'outlined'} onClick={() => toggleThemeMode()}>
            <span>toggle theme</span>
          </Button>
          <ConnectButton />
          <Button onClick={run} variant="contained" fullWidth>
            Approve
          </Button>
        </Box>
        <Stack spacing={10}>
          <Typography variant="h1">h1 Typography</Typography>
          <Typography variant="body1">Typography</Typography>
          <Input value={''} label="label" />

          <InputLabel>111</InputLabel>
          <CheckBox checked={true} />

          <Divider />

          <MuiCustomThemeProvider>
            <Typography variant="h1">Custom Theme</Typography>
            <Button onClick={run} variant="contained">
              run
            </Button>
          </MuiCustomThemeProvider>
        </Stack>
      </StyledContainer>
    </>
  )
}
