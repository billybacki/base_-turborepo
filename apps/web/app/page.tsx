'use client'
import Image from 'next/image'
import { Button } from '@repo/ui/button'
import styles from './page.module.css'
import { WalletConnectButton } from './components/WalletConnectButton'
import { useNotification } from '@repo/material-ui'
import { useApproveCallback, useToken } from '@repo/evm-wallet'
import { CurrencyAmount } from '@repo/currency'

export default function Home() {
  const { success, error } = useNotification()
  const { token } = useToken('0x85eDB7A0cbAcf5BD641e0FF5D6270bEf9C72Bd6B', 11155111)
  console.log('🚀 ~ Home ~ data:', token)
  const { approvalState, approve, approveWithModal } = useApproveCallback(
    token ? CurrencyAmount.fromAmount(token, '100') : undefined,
    '0x70B6c88f608AC228Fd767d05094967eb91d02583'
  )
  console.log('🚀 ~ Home ~ approvalState:', approvalState)

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image className={styles.logo} src="/next.svg" alt="Next.js logo" width={180} height={38} priority />
        <ol>
          <li>
            Get started by editing <code>app/page.tsx</code>
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <WalletConnectButton />

        <button onClick={approve}>approve</button>
        <button onClick={approveWithModal}>approveWithModal</button>

        <button
          onClick={() =>
            success('Hello world', {
              autoHideDuration: 1000,
              anchorOrigin: {
                horizontal: 'center',
                vertical: 'top'
              }
            })
          }
        >
          hello
        </button>
        <button
          onClick={() =>
            error(
              <>
                <Image className={styles.logo} src="/next.svg" alt="Next.js logo" width={180} height={38} priority />
                <ol>
                  <li>
                    Get started by editing <code>app/page.tsx</code>
                  </li>
                  <li>Save and see your changes instantly.</li>
                </ol>
              </>
            )
          }
        >
          error
        </button>
        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image className={styles.logo} src="/vercel.svg" alt="Vercel logomark" width={20} height={20} />
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
        <Button appName="web" className={styles.secondary}>
          Open alert
        </Button>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/file-text.svg" alt="File icon" width={16} height={16} />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  )
}
