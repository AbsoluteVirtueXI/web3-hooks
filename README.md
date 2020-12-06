# web3-hooks

> react hooks for web3

[![NPM](https://img.shields.io/npm/v/web3-hooks.svg)](https://www.npmjs.com/package/web3-hooks) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

**This package still need heavy testing.**
**It comes actually in an experimental version.**
**Only works with Metamask actually**

## Install

```bash
yarn add web3-hooks
```

## Usage

```jsx
import React, { useContext } from 'react'

import { Web3Context } from 'web3-hooks'

const App = () => {
  const [web3State, login] = useContext(Web3Context)
  return (
    <>
      <p>Web3: {web3State.is_web3 ? 'injected' : 'no-injected'}</p>
      <p>Network id: {web3State.chain_id}</p>
      <p>Network name: {web3State.network_name}</p>
      <p>MetaMask installed: {web3State.is_metamask ? 'yes' : 'no'}</p>
      <p>logged: {web3State.is_logged ? 'yes' : 'no'}</p>
      <p>account: {web3State.account}</p>
      <p>Balance: {web3State.balance}</p>
      {!web3State.is_logged && (
        <>
          <button onClick={login}>login</button>
        </>
      )}
    </>
  )
}
```

## Features

Real time accounts and networks change tracking
Real time ether balance tracking
Simplified use of contract with `useContract` hook

## License

MIT © [AbsoluteVirtueXI](https://github.com/AbsoluteVirtueXI)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
