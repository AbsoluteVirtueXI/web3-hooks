import React from 'react'
import ReactDOM from 'react-dom'
import { Web3Provider } from 'web3-hooks'
import { ChakraProvider, theme } from '@chakra-ui/react'
import './index.css'
import App from './App'

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <Web3Provider>
      <App />
    </Web3Provider>
  </ChakraProvider>,
  document.getElementById('root')
)
