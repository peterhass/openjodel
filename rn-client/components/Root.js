import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Route, Link, Redirect } from 'react-router-native'
import LoginContainer from './LoginContainer'
import ThreadListContainer from './ThreadListContainer'
import ThreadContainer from './ThreadContainer'
import { auth } from '../apollo_client'
import { SecureStore } from 'expo'
class PrivateRoute extends React.Component {
  constructor() {
    super()

    this.checkAuthentication = this.checkAuthentication.bind(this)
    this.state = { isAuthenticated: null }
  }

  componentDidMount() {
    auth.getTokenAsync().then(this.checkAuthentication)
    auth.subscribe(this.checkAuthentication)
  }

  componentWillUnmount() {
    auth.unsubscribe(this.checkAuthentication)
  }

  checkAuthentication(authenticated) {
    this.setState({ isAuthenticated: !!authenticated })
  }

  render() {
    const { component: Component, ...rest } = this.props
    const { isAuthenticated } = this.state

    if (isAuthenticated === null)
      return (null)

    return (
      <Route {...rest} render={(props) => (
          isAuthenticated === true
          ? <Component {...props} />
          : <Redirect to='/login' />
        )} />

    )
  }
}


export default class Root extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.nav}>
          <Link to="/threads">
            <Text>Threads</Text>
          </Link>
          <Button title="reset" onPress={() => auth.setTokenAsync(null)} />
        </View>

        <Route exact path="/login" component={LoginContainer} />
        <PrivateRoute exact path="/threads" component={ThreadListContainer} />
        <PrivateRoute exact path="/threads/:threadId" component={ThreadContainer} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
});


