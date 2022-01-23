import React, { useEffect, useState } from 'react';
import Button from '@/components/button/Button';
import './home.scss';

const CONNECTED = 'connected';
const NOT_CONNECTED = 'not connected';

const Home = () => {
  const [walletStatus, setWalletStatus] = useState(NOT_CONNECTED);
  const [currentAccount, setCurrentAccount] = useState('')

  const checkIsWalletConnected = () => {
    const { ethereum } = window
    if (ethereum) {
      setWalletStatus(CONNECTED)
    } else {
      return
    }

    const accounts = ethereum.request({ method: 'eth_accounts' })
    if (accounts.length > 0) {
      const account = accounts[0]
      console.log(account)
      setCurrentAccount(account)
    } else {
      console.log('no accounts found')
    }
  }

  useEffect(() => {
    checkIsWalletConnected()
  }, [])

  return (
    <div className="home">
      <div>
        Wallet status: { walletStatus }
      </div>
      <div>
        Account: { currentAccount }
      </div>
      <Button
        title={"Connect Wallet"}
      />
    </div>
  )
}

export default Home