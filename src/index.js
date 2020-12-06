import * as React from 'react'
import { useWeb3, Web3Context, Web3Provider } from './useWeb3'
import { useContract } from './useContract'

const useMyHook = () => {
  let [{ counter }, setState] = React.useState({
    counter: 0,
  })

  React.useEffect(() => {
    let interval = window.setInterval(() => {
      counter++
      setState({ counter })
    }, 1000)
    return () => {
      window.clearInterval(interval)
    }
  }, [])

  return counter
}

export { useMyHook, useWeb3, Web3Context, Web3Provider, useContract }
