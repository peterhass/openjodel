import React from 'react';
import { NativeRouter } from 'react-router-native'
import Root from './components/Root'
import client from './apollo_client'
import { ApolloProvider } from 'react-apollo'



export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <NativeRouter>
          <Root />
        </NativeRouter>
      </ApolloProvider>
    );
  }
}
