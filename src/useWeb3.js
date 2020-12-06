// export Web3 provider
// export useWeb3()
import React, { useCallback, useEffect, useReducer } from 'react'
import { ethers } from 'ethers'
import {
  isWeb3,
  isMetaMask,
  getAccounts,
  loginToMetaMask,
  chainIdtoName,
} from './web3-utils'

// web3 reducer
const web3Reducer = (state, action) => {
  switch (action.type) {
    case 'SET_is_web3':
      return { ...state, is_web3: action.is_web3 }
    case 'SET_is_metamask':
      return { ...state, is_metamask: action.is_metamask }
    case 'SET_is_logged':
      return { ...state, is_logged: action.is_logged }
    case 'SET_account':
      return { ...state, account: action.account }
    case 'SET_provider':
      return { ...state, provider: action.provider }
    case 'SET_signer':
      return { ...state, signer: action.signer }
    case 'SET_balance':
      return { ...state, balance: action.balance }
    case 'SET_chain_id':
      return { ...state, chain_id: action.chain_id }
    case 'SET_network_name':
      return { ...state, network_name: action.network_name }
    default:
      throw new Error(`Unhandled action ${action.type} in web3Reducer`)
  }
}

// web3 initial state
const web3InitialState = {
  is_web3: false,
  is_logged: false,
  is_metamask: false,
  account: ethers.constants.AddressZero,
  balance: 0,
  chain_id: 0,
  network_name: 'unknown',
  eth_balance: ethers.utils.parseEther('0'),
  signer: null,
  provider: null,
}

// web3 hook
export const useWeb3 = (endpoint) => {
  const [web3State, web3Dispatch] = useReducer(web3Reducer, web3InitialState)

  // login in to MetaMask manually.
  // TODO: Check for login on other wallet
  const login = useCallback(async () => {
    try {
      if (web3State.is_web3 && !web3State.is_logged) {
        const accounts = await loginToMetaMask()
        web3Dispatch({ type: 'SET_account', account: accounts[0] })
        web3Dispatch({ type: 'SET_is_logged', is_logged: true })
      }
    } catch (e) {
      // user rejects the login attempt to MetaMask
      web3Dispatch({ type: 'SET_account', account: web3InitialState.account })
      web3Dispatch({ type: 'SET_is_logged', is_logged: false })
    }
  }, [web3State.is_web3, web3State.is_logged])

  // Check if web3 is injected
  // TODO: maybe can check on each render (case of user uninstalling metamasl)
  useEffect(() => {
    console.log('hooks: is_web3 called')
    web3Dispatch({ type: 'SET_is_web3', is_web3: isWeb3() })
  }, [])

  // Listen for networks changes events
  useEffect(() => {
    if (web3State.is_web3) {
      console.log('network listener called')

      const onChainChanged = async (chain_id) => {
        const _chain_id = parseInt(Number(chain_id), 10)
        const _network_name = chainIdtoName(_chain_id)
        console.log('network id changed:', _chain_id)
        console.log('network name changed:', _network_name)
        web3Dispatch({
          type: 'SET_chain_id',
          chain_id: _chain_id,
        })
        web3Dispatch({
          type: 'SET_network_name',
          network_name: _network_name,
        })
      }
      window.ethereum.on('chainChanged', onChainChanged)
      return () => window.ethereum.off('chainChanged', onChainChanged)
    }
  }, [web3State.is_web3])

  // Check if metamask is installed
  useEffect(() => {
    if (web3State.is_web3) {
      web3Dispatch({ type: 'SET_is_metamask', is_metamask: isMetaMask() })
    }
  }, [web3State.is_web3])

  // check if logged in to metamask and get account
  useEffect(() => {
    ;(async () => {
      if (web3State.is_web3) {
        try {
          const accounts = await getAccounts()
          if (accounts.length === 0) {
            // If not logged
            web3Dispatch({ type: 'SET_is_logged', is_logged: false })
            web3Dispatch({
              type: 'SET_account',
              account: web3InitialState.account,
            })
          } else {
            // Already logged
            web3Dispatch({ type: 'SET_account', account: accounts[0] })
            web3Dispatch({ type: 'SET_is_logged', is_logged: true })
          }
        } catch (e) {
          throw e
        }
      }
    })()
  }, [web3State.is_web3])

  // Listen for addresses change event
  useEffect(() => {
    if (web3State.is_web3) {
      const onAccountsChanged = (accounts) => {
        console.log('account changed')
        web3Dispatch({ type: 'SET_account', account: accounts[0] })
      }
      window.ethereum.on('accountsChanged', onAccountsChanged)
      return () => window.ethereum.off('accountsChanged', onAccountsChanged)
    }
  }, [web3State.is_web3])

  // Connect to provider and signer
  useEffect(() => {
    if (web3State.account !== web3InitialState.account) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      web3Dispatch({ type: 'SET_provider', provider: provider })
      const signer = provider.getSigner()
      web3Dispatch({ type: 'SET_signer', signer: signer })
    } else {
      web3Dispatch({
        type: 'SET_provider',
        provider: web3InitialState.provider,
      })
      web3Dispatch({ type: 'SET_signer', signer: web3InitialState.signer })
    }
  }, [web3State.account, web3State.chain_id])

  // Get ETH amount
  useEffect(() => {
    ;(async () => {
      console.log('provider:', web3State.provider)
      if (
        web3State.provider &&
        web3State.account !== web3InitialState.account
      ) {
        const _balance = await web3State.provider.getBalance(web3State.account)
        const balance = ethers.utils.formatEther(_balance)
        web3Dispatch({ type: 'SET_balance', balance: balance })
      } else {
        web3Dispatch({
          type: 'SET_balance',
          balance: web3InitialState.balance,
        })
      }
    })()
  }, [web3State.provider, web3State.account])

  // Listen for balance change for webState.account
  useEffect(() => {
    if (web3State.provider) {
      console.log('USEFFECT FOR BALANCE CHANGE')
      console.log('typeof account:', typeof web3State.account)
      console.log('account: ', web3State.account)

      const updateBalance = async (_blockNumber) => {
        console.log('NEW BLOCK MINED')
        const _balance = await web3State.provider.getBalance(web3State.account)
        const balance = ethers.utils.formatEther(_balance)
        if (web3State.account !== web3InitialState.account) {
          web3Dispatch({ type: 'SET_balance', balance: balance })
        } else {
          web3Dispatch({
            type: 'SET_balance',
            balance: web3InitialState.balance,
          })
        }
      }

      web3State.provider.on('block', updateBalance)

      return () => web3State.provider.off('block', updateBalance)
    }
  }, [web3State.provider, web3State.account])

  // GET netword_name and chain_id
  useEffect(() => {
    console.log('GET NETWORK CALLED')
    ;(async () => {
      if (web3State.provider) {
        const network = await web3State.provider.getNetwork()
        web3Dispatch({ type: 'SET_chain_id', chain_id: network.chainId })
        web3Dispatch({
          type: 'SET_network_name',
          network_name: chainIdtoName(network.chainId),
        })
      }
    })()
  }, [web3State.provider])

  return [web3State, login]
}

// Web3 context
export const Web3Context = React.createContext(null)

// Web3 provider
export const Web3Provider = ({ children }) => {
  return (
    <>
      <Web3Context.Provider value={useWeb3()}>{children}</Web3Context.Provider>
    </>
  )
}
