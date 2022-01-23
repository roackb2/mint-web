import { ethers } from "ethers";
import {
  EpicNftAddr,
  EpicNftAbi
} from '@/lib/constants';

export default class MyEpicNFT {
  constructor () {
    this.getProvider()
    this.getSigner()
  }

  getProvider () {
    if (!window.ethereum) {
      throw new Error("Ethereum object not exists")
    }
    if (!this.provider) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum)
    }
    return this.provider
  }

  getSigner () {
    if (!this.signer) {
      this.signer = this.provider.getSigner()
    }
    return this.signer
  }

  getContract () {
    if (!this.contract) {
      this.contract = new ethers.Contract(EpicNftAddr, EpicNftAbi, this.getSigner())
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
    console.log('start minting')
    await txn.wait()
    console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${txn.hash}`);
    setLoading(false)
    return txn
  }
}