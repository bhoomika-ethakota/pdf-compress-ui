import * as React from 'react'

import Home from './Home'
import './App.css'
// 1. import `ChakraProvider` component
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  // 2. Wrap ChakraProvider at the root of your app
  return (
    <ChakraProvider disableGlobalStyle>
      <Home />
      </ChakraProvider>
  )
}

export default App