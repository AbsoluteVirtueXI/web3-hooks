import React, { useContext } from 'react'
import { Text, Button } from '@chakra-ui/react'
import { Web3Context } from 'web3-hooks'
const App = () => {
  const [web3State, login] = useContext(Web3Context)
  return (
    <>
      <Text>Web3: {web3State.is_web3 ? 'injected' : 'no-injected'}</Text>
      <Text>Network id: {web3State.chain_id}</Text>
      <Text>Network name: {web3State.network_name}</Text>
      <Text>MetaMask installed: {web3State.is_metamask ? 'yes' : 'no'}</Text>
      <Text>logged: {web3State.is_logged ? 'yes' : 'no'}</Text>
      <Text>{web3State.account}</Text>
      <Text>Balance: {web3State.balance}</Text>
      {!web3State.is_logged && (
        <>
          <Button onClick={login}>login</Button>
        </>
      )}
    </>
  )
}
export default App
