import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { onError } from 'apollo-link-error'
import { ApolloLink, split } from 'apollo-link'
import { setContext  } from 'apollo-link-context'
import { getMainDefinition } from 'apollo-utilities'
import {Socket as PhoenixSocket} from 'phoenix'
import * as AbsintheSocket from '@absinthe/socket'
import { createAbsintheSocketLink } from '@absinthe/socket-apollo-link'

const setAuthToken = (token) => localStorage.setItem('auth-token', token)
const getAuthToken = () => localStorage.getItem('auth-token')

const cache = new InMemoryCache()
const link = ApolloLink.from([
  onError(({ graphQLErrors, networkError  }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) => {
        console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
      })

    if (networkError)
      console.error(`[Network error]: ${networkError}`)
  }),

  setContext((_, { headers }) => {
    // get token from users machine
    const token = getAuthToken()
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ""
      }
    }
  }),

  

  split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    createAbsintheSocketLink(AbsintheSocket.create(
      new PhoenixSocket(`ws://${location.hostname}:${location.port}/socket`, { params: { token: getAuthToken() } })
    )),

    new HttpLink({
      uri: "/api/graphql" 
    })

  )
])


const client = new ApolloClient({
  link,
  cache
})

export { getAuthToken, setAuthToken }
export default client
