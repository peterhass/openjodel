import React from 'react'
import { render } from 'react-dom'
import App from './components/App'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import client from './apollo_client'

render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root')
)
