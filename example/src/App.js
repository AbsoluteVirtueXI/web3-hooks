import React, { useContext } from 'react'
import { Text, Button } from '@chakra-ui/react'
import { Web3Context } from 'web3-hooks'
const App = () => {
  const [web3State, login] = useContext(Web3Context)
  return (
    <>
      <Text>Web3: {web3State.isWeb3 ? 'injected' : 'no-injected'}</Text>
      <Text>Network id: {web3State.chainId}</Text>
      <Text>Network name: {web3State.networkName}</Text>
      <Text>MetaMask installed: {web3State.isMetaMask ? 'yes' : 'no'}</Text>
      <Text>logged: {web3State.isLogged ? 'yes' : 'no'}</Text>
      <Text>{web3State.account}</Text>
      <Text>Balance: {web3State.balance}</Text>
      {!web3State.isLogged && (
        <>
          <Button onClick={login}>login</Button>
        </>
      )}
    </>
  )
}
export default App
