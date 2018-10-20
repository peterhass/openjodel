import React from 'react'
import { ActivityIndicator, View, StatusBar } from 'react-native'
import Settings from '../utils/Settings'

export default class AuthLoading extends React.Component {
  constructor() {
    super()

    this.checkAuthentication = this.checkAuthentication.bind(this)
  }

  componentDidMount() {
    Settings.authToken.subscribe(this.checkAuthentication, true)
  }

  componentWillUnmount() {
    Settings.authToken.unsubscribe(this.checkAuthentication)
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
