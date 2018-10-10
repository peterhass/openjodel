import React from 'react';
import buildClient from './apollo_client'
import { ApolloProvider } from 'react-apollo'
import { createSwitchNavigator, createStackNavigator } from 'react-navigation'
import ThreadListContainer from './screens/ThreadListContainer'
import LoginContainer from './screens/LoginContainer'
import AuthLoading from './screens/AuthLoading'
import NewThreadContainer from './screens/NewThreadContainer'
import ThreadContainer from './screens/ThreadContainer'

const AppStack = createStackNavigator({
  Home: ThreadListContainer,
  NewThread: NewThreadContainer,
  Thread: ThreadContainer,
})

const AuthStack = createStackNavigator({
  Login: LoginContainer
})

const Navigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoading,
    App: AppStack,
    Auth: AuthStack
  },
  { initialRouteName: 'AuthLoading' }
)

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
        <Navigator />
      </ApolloProvider>
    );
  }
}
