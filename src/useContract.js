import { ethers } from 'ethers'
import React, { useState, useEffect, useContext } from 'react'
import { Web3Context } from './useWeb3'

export const useContract = (address, abi) => {
  const [web3State, _] = useContext(Web3Context)
  const [contract, setContract] = useState(null)
  useEffect(() => {
    if (web3State.signer) {
      setContract(new ethers.Contract(address, abi, web3State.signer))
    } else {
      setContract(null)
    }
  }, [web3State.signer, address, abi])
  return contract
}
