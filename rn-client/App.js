import React from 'react';
import buildClient from './apollo_client'
import { ApolloProvider } from 'react-apollo'
import { createSwitchNavigator, createStackNavigator } from 'react-navigation'
import ThreadListContainer from './screens/ThreadListContainer'
import LoginContainer from './screens/LoginContainer'
import AuthLoading from './screens/AuthLoading'
import NewThreadContainer from './screens/NewThreadContainer'
import ThreadContainer from './screens/ThreadContainer'
import StreamSelectionContainer from './screens/StreamSelectionContainer'
import NewStreamContainer from './screens/NewStreamContainer'
import ThreadsMapContainer from './screens/ThreadsMapContainer'
import HomeScreenLocator from './utils/HomeScreenLocator'

const AppStack = createStackNavigator({
  Home: ThreadListContainer,
  NewThread: NewThreadContainer,
  Thread: ThreadContainer,
  StreamSelection: StreamSelectionContainer,
  NewStream: NewStreamContainer,
  ThreadsMap: ThreadsMapContainer
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
    
    this.homeScreenLocator = new HomeScreenLocator()
    this.state = {  }
  }

  componentDidMount() {
    buildClient().then(client => this.setState({ client }))
    // TODO: move this elsewhere. if user is not authenticated, mutations could fail because of missing authentication
    this.homeScreenLocator.start()
  }

  componentWillUnmount() {
    this.homeScreenLocator.stop()
  }

  render() {
    const { client } = this.state
    
    this.homeScreenLocator.graphqlClient = client
    
    if (client === undefined)
      return (null)

    return (
      <ApolloProvider client={client}>
        <Navigator />
      </ApolloProvider>
    );
  }
}
