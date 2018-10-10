import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { onError } from 'apollo-link-error'
import { ApolloLink, split } from 'apollo-link'
import { setContext  } from 'apollo-link-context'
import { getMainDefinition } from 'apollo-utilities'
import {Socket as PhoenixSocket} from './phoenix-lib.js'
import * as AbsintheSocket from '@absinthe/socket'
import { createAbsintheSocketLink } from '@absinthe/socket-apollo-link'
import { SecureStore } from 'expo'
import { BACKEND_HOST } from 'react-native-dotenv'
import { createLink as createHttpLink } from 'apollo-absinthe-upload-link'

const HttpEndpoint = {
  uri: `http://${BACKEND_HOST}/api/graphql`
}

const SocketEndpoint = {
  uri: `ws://${BACKEND_HOST}/socket`
}

class Auth {
  constructor() {
    this.subscribers = []
  }

  subscribe(fn) {
    return this.subscribers.push(fn)
  }

  unsubscribe(fn) {
    this.subscribers = this.subscribers.filter((item) => item !== fn)
  }

  setTokenAsync(token) {
    const promise = token !== null ? SecureStore.setItemAsync('auth-token', token)
 : SecureStore.deleteItemAsync('auth-token')

    return promise.then(() => {
      this.notifyAll(token)
    })
  }

  getTokenAsync() {
    return SecureStore.getItemAsync('auth-token')
  }
  
  notifyAll(value) {
    this.subscribers.forEach(subscriber => subscriber(value))
  }
}

const auth = new Auth()

const buildClient = () => {

  return auth.getTokenAsync().then((token) => {
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

      setContext((_, { headers }) => (
        // get token from users machine
        {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ""
          }
        }
      )),

      

      split(
        ({ query }) => {
          const { kind, operation } = getMainDefinition(query)
          return kind === 'OperationDefinition' && operation === 'subscription'
        },
        createAbsintheSocketLink(AbsintheSocket.create(
          new PhoenixSocket(SocketEndpoint.uri, { params: { token } })
        )),

        createHttpLink({
          uri: HttpEndpoint.uri 
        })

      )
    ])

    return new ApolloClient({
      link,
      cache
    })
  })

}
export { auth, buildClient }
export default buildClient
