import React, { useEffect, useState } from 'react';
import Button from '@/components/button/Button';
import MyEpicNFT from '@/lib/MyEpicNFT';
import './home.scss';

const Home = () => {
  const [loading, setLoading] = useState(false)
  const [metaMaskExists, setMetaMaskExists] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [contract, setContract] = useState(null)
  const [currentAccount, setCurrentAccount] = useState('')
  const [mintHash, setMintHash] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (window.ethereum) {
      setMetaMaskExists(true)
      setContract(new MyEpicNFT())
    }
  }, [])

  const handleConnectClick = async () => {
    try {
      await contract.connectWallet()
      setWalletConnected(true)
      const accounts = await contract.listAccounts()
      if (accounts.length > 0) {
        const account = accounts[0]
        setCurrentAccount(account)
      }
    } catch (err) {
      console.warn(err)
      if (err.code === 4001) {
        setMessage('You canceled the connection')
      }
    }
  }

  const handleMintClick = async () => {
    try {
      const res = await contract.mintWords(setLoading)
      setMintHash(res.hash)
      console.log(res)
    } catch (err) {
      console.warn(err)
    }
  }

  return metaMaskExists ? (
    <div className="home">
      <div className="section">
        Wallet status: { walletConnected ? 'connected' : 'not connected' }
      </div>
      <div className="section">
        Account: { currentAccount }
      </div>
      <div className="section">
        {
          walletConnected ? (
            <Button
              title={"Mint NFT!"}
              onClick={() => handleMintClick()}
            />            
          ) : (
            <Button
              title={"Connect Wallet"}
              onClick={() => handleConnectClick()}
            />
          )
        }
        <div className="message">
        { message }
        </div>
      </div>
      <div className="section">
        { mintHash !== '' ? (
          <div>
            <div className="sentence">
              { "Mined, see transaction on " }
              <a href={`https://rinkeby.etherscan.io/tx/${mintHash}`} target="_blank" rel="noreferrer">
                Etherscan (Rinkeby)
              </a>
            </div>
            <div className="sentence">
            { "Or view it on " }
              <a href={`https://testnets.opensea.io/${currentAccount}`} target="_blank" rel="noreferrer">
                OpenSea (testnets)
              </a>
              { " to sea your collections!" }
            </div>
          </div>
        ) : null }
      </div>
      <div className="section loading">
        { loading ? 'Please wait, minting might take a few minutes...' : null }
      </div>
    </div>
  ) : (
    <div className="home">
      Please install MetaMask first
    </div>
  )
}

export default Home