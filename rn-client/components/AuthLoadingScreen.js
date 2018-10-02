import React from 'react'
import { ActivityIndicator, View, StatusBar } from 'react-native'
import { auth } from '../apollo_client'

export default class AuthLoadingScreen extends React.Component {
  constructor() {
    super()

    //auth.setTokenAsync(null)
    this.checkAuthentication = this.checkAuthentication.bind(this)
  }

  componentDidMount() {
    auth.getTokenAsync().then(this.checkAuthentication)
    auth.subscribe(this.checkAuthentication)
  }

  componentWillUnmount() {
    auth.unsubscribe(this.checkAuthentication)
  }

  checkAuthentication(authenticated) {
    this.props.navigation.navigate(authenticated ? 'App' : 'Auth')
  }

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    )
  }
}
