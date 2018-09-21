import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Route, Link, Redirect } from 'react-router-native'
import LoginContainer from './LoginContainer'
import ThreadListContainer from './ThreadListContainer'
import { getAuthToken } from '../apollo_client'

const auth = {
  get isAuthenticated() { return !!getAuthToken() } 
}

const _PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    auth.isAuthenticated === true
    ? <Component {...props} />
    : <Redirect to='/login' />
  )} />
)

class PrivateRoute extends React.Component {
  constructor() {
    super()

    this.state = { isAuthenticated: null }
  }

  componentDidMount() {
    getAuthToken().then((authenticated) => this.setState({ isAuthenticated: !!authenticated }))
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
        </View>

        <Route exact path="/login" component={LoginContainer} />
        <PrivateRoute exact path="/threads" component={ThreadListContainer} />
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


