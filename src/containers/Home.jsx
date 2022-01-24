import React, { useEffect, useState, useCallback } from 'react';
import Button from '@/components/button/Button';
import MyEpicNFT from '@/lib/MyEpicNFT';
import { EpicNftAddr } from '@/lib/constants';
import './home.scss';

const Home = () => {
  const [loading, setLoading] = useState(false)
  const [metaMaskExists, setMetaMaskExists] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [contract, setContract] = useState(null)
  const [currentAccount, setCurrentAccount] = useState('')
  const [mintHash, setMintHash] = useState('')
  const [message, setMessage] = useState('')
  const [mintedTokenId, setMintedTokenId] = useState('')

  const itemMintedCallback = (from, tokenId) => {
    setMintedTokenId(tokenId)
  }

  useEffect(() => {
    let c = null
    if (window.ethereum) {
      setMetaMaskExists(true)
      c = new MyEpicNFT()
      setContract(c)
      c.subscribeItemMinted(itemMintedCallback)
    }
    return () => {
      c.unsubscribeItemMinted(itemMintedCallback)
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
              <a href={`https://testnets.opensea.io/assets/${EpicNftAddr}/${mintedTokenId}`} target="_blank" rel="noreferrer">
                OpenSea (testnets)
              </a>
              { " to see the minted asset!" }
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