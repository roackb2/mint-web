import { ethers } from "ethers";
import {
  EpicNftAddr,
  EpicNftAbi
} from '@/lib/constants';

export default class MyEpicNFT {
  constructor () {
    this.getProvider()
    this.getSigner()
    this.itemMintedCallbacks = [];
  }

  getProvider () {
    if (!window.ethereum) {
      throw new Error("Ethereum object not exists")
    }
    if (!this.provider) {
      const { ethereum } = window
      this._eth = ethereum
      this.provider = new ethers.providers.Web3Provider(ethereum)
    }
    return this.provider
  }

  getSigner () {
    if (!this.signer) {
      this.signer = this.provider.getSigner()
    }
    return this.signer
  }

  async getChainId () {
    let chainId = await this._eth.request({ method: 'eth_chainId' })
    return chainId
  }

  subscribeItemMinted(cb) {
    this.itemMintedCallbacks.push(cb)
  }

  unsubscribeItemMinted(cb) {
    this.itemMintedCallbacks = this.itemMintedCallbacks.filter(i => i !== cb)
  }

  _itemMinted (from, tokenId) {
    this.itemMintedCallbacks.forEach(cb => cb(from, tokenId))
  }

  getContract () {
    if (!this.contract) {
      this.contract = new ethers.Contract(EpicNftAddr, EpicNftAbi, this.getSigner())
      this.contract.on("NewEpicNFTMinted", this._itemMinted.bind(this))
    }
    return this.contract
  }

  connectWallet () {
    return this.provider.send("eth_requestAccounts", [])
  }

  listAccounts () {
    return this.provider.listAccounts();
  }

  async mintWords (setLoading) {
    setLoading(true)
    const contract = this.getContract()
    let txn = await contract.mintWords()
    console.info('start minting')
    await txn.wait()
    console.info(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${txn.hash}`);
    setLoading(false)
    return txn
  }
}