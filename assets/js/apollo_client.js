import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { setContext  } from 'apollo-link-context'

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

  new HttpLink({
    uri: "/api/graphql" 
  }),


])


const client = new ApolloClient({
  link,
  cache
})

export { getAuthToken, setAuthToken }
export default client
