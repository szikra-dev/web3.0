import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

import { contractABI, contractAddress } from '../utils/constans'

export const TransactionContext = React.createContext()

const { ethereum } = window

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer,
  )

  return transactionContract
}

export const TransactionProvider = ({ children }) => {
  const [connectedAccount, setConnectedAccount] = useState('')
  const [formData, setFormData] = useState({
    addressTo: '',
    amount: '',
    keyword: '',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem('transactionCount'),
  )

  const handleChange = (e, name) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: e.target.value,
    }))
  }

  const checkedIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert('Please install metamask')

      const accounts = await ethereum.request({ method: 'eth_accounts' })
      if (accounts.length) {
        setConnectedAccount(accounts[0])
        // getAllTransactions()
      } else {
        console.log('No accounts found')
      }
    } catch (error) {
      console.log(error)
      throw new Error('No ethereum object')
    }
  }

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert('Please install metamask')
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      if (accounts.length) {
        setConnectedAccount(accounts[0])
      } else {
        console.log('No accounts found')
      }
    } catch (error) {
      console.log(error)
      throw new Error('No ethereum object')
    }
  }

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert('Please install metamask')

      const { addressTo, amount, keyword, message } = formData
      const transactionContract = getEthereumContract()
      const parsedAmount = ethers.utils.parseEther(amount)

      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: connectedAccount,
            to: addressTo,
            gas: '0x5208', // 21000 GWEI in HEX
            value: parsedAmount._hex,
          },
        ],
      })

      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword,
      )

      setIsLoading(true)
      console.log(`Loading - TX_hash - ${transactionHash.hash}`)
      await transactionHash.wait()
      setIsLoading(false)
      console.log(`Success - TX_hash - ${transactionHash.hash}`)

      const transactionCount = await transactionContract.getTransactionCount()

      setTransactionCount(transactionCount.toNumber())
    } catch (error) {
      console.log(error)
      throw new Error('No ethereum object')
    }
  }

  useEffect(() => {
    checkedIfWalletIsConnected()
  }, [])

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        connectedAccount,
        handleChange,
        formData,
        setFormData,
        sendTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
