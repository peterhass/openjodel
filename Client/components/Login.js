import React from 'react'
import { Text, View, Button, TextInput, StyleSheet } from 'react-native'

export default class Login extends React.Component {
  constructor() {
    super()
    this.state = { restoreToken: '' }
  }

  render() {
    const { onRestore, onSignup } = this.props
    const { restoreToken } = this.state

    return (
      <View>
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
          <View style={styles.startGroup}>
            <Button title="Start" style={{backgroundColor: 'black'}} onPress={() => onSignup()} />
          </View>
          <Text style={styles.orGroup}>or</Text>
          <View style={styles.restoreGroup}>
            <TextInput style={styles.restoreText} onChangeText={(text) => this.setState({ restoreToken: text })} />
            <Button title="Restore" onPress={() => onRestore({token: restoreToken})} />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    
  },

  startGroup: {
    padding: 50
  },

  restoreGroup: {
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: 50
  },

  restoreText: {
    width: '50%',
    borderWidth: 1,
    borderColor: "gray",
  }
})
