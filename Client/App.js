import React from 'react';
import { NativeRouter } from 'react-router-native'
import Root from './components/Root'
import buildClient from './apollo_client'
import { ApolloProvider } from 'react-apollo'



export default class App extends React.Component {
  constructor() {
    super()
    
    this.state = {  }
  }

  componentDidMount() {
    buildClient().then(client => this.setState({ client }))
  }

  render() {
    const { client } = this.state
    
    if (client === undefined)
      return (null)

    return (
      <ApolloProvider client={client}>
        <NativeRouter>
          <Root />
        </NativeRouter>
      </ApolloProvider>
    );
  }
}
