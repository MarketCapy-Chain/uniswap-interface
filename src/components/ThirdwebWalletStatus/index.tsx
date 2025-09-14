import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { ConnectWallet, useAddress, useDisconnect } from '@thirdweb-dev/react'
import { darken, lighten } from 'polished'
import { Activity } from 'react-feather'
import { useHasSocks } from '../../hooks/useSocksBalance'
import { useWalletModalToggle } from '../../state/application/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'

import Identicon from '../Identicon'
import { ButtonSecondary } from '../Button'
import { RowBetween } from '../Row'
import { shortenAddress } from '../../utils'
import { useAllTransactions } from '../../state/transactions/hooks'
import Loader from '../Loader'

const Web3StatusGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
`

const Web3StatusConnected = styled(Web3StatusGeneric)<{ pending?: boolean }>`
  background-color: ${({ pending, theme }) => (pending ? theme.primary1 : theme.bg2)};
  border: 1px solid ${({ pending, theme }) => (pending ? theme.primary1 : theme.bg3)};
  color: ${({ pending, theme }) => (pending ? theme.white : theme.text1)};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ pending, theme }) => (pending ? darken(0.05, theme.primary1) : lighten(0.05, theme.bg2))};

    :focus {
      border: 1px solid ${({ pending, theme }) => (pending ? darken(0.1, theme.primary1) : darken(0.1, theme.bg3))};
    }
  }
`

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
`

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

const StyledConnectWallet = styled.div`
  .tw-connect-wallet {
    background-color: ${({ theme }) => theme.primary4} !important;
    border: none !important;
    color: ${({ theme }) => theme.primaryText1} !important;
    font-weight: 500 !important;
    border-radius: 12px !important;
    padding: 0.5rem !important;
    font-family: inherit !important;
    font-size: 1rem !important;
    
    :hover,
    :focus {
      border: 1px solid ${({ theme }) => darken(0.05, theme.primary4)} !important;
      color: ${({ theme }) => theme.primaryText1} !important;
    }
  }
`

// we want the latest one to come first, so return negative if a is after b
function newTranscationsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

function recentTransactionsOnly(a: TransactionDetails) {
  return new Date().getTime() - a.addedTime < 86_400_000
}

const SOCK = (
  <span role="img" aria-label="has socks emoji" style={{ marginTop: -4, marginBottom: -4 }}>
    🧦
  </span>
)

export default function ThirdwebWalletStatus() {
  const { t } = useTranslation()
  const address = useAddress()
  const disconnect = useDisconnect()

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = React.useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(recentTransactionsOnly).sort(newTranscationsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  const hasPendingTransactions = !!pending.length
  const hasSocks = useHasSocks()
  const toggleWalletModal = useWalletModalToggle()

  if (address) {
    return (
      <Web3StatusConnected 
        id="web3-status-connected" 
        onClick={toggleWalletModal} 
        pending={hasPendingTransactions}
      >
        {hasPendingTransactions ? (
          <RowBetween>
            <Text>{pending?.length} Pending</Text> <Loader stroke="white" />
          </RowBetween>
        ) : (
          <>
            {hasSocks ? SOCK : null}
            <Text>{shortenAddress(address)}</Text>
          </>
        )}
        {!hasPendingTransactions && <Identicon />}
      </Web3StatusConnected>
    )
  }

  return (
    <StyledConnectWallet>
      <ConnectWallet 
        theme="dark"
        btnTitle={t('Connect to a wallet')}
        modalTitle="Connect your wallet"
        modalSize="wide"
        welcomeScreen={{
          title: "Connect to Uniswap",
          subtitle: "Connect your wallet to start trading"
        }}
      />
    </StyledConnectWallet>
  )
}