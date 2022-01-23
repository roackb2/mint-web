import { ethers } from "ethers";
import {
  EpicNftAddr,
  EpicNftAbi
} from '@/lib/constants';

export const provider = new ethers.providers.Web3Provider(window.ethereum)
export const signer = provider.getSigner()
export const connectWallet = () => provider.send("eth_requestAccounts", [])
export const getEpicNftContract = () => {
  return new ethers.Contract(EpicNftAddr, EpicNftAbi, provider)
}
