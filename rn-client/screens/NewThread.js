import React from 'react'
import { View, Text, FlatList, Button, StyleSheet, TextInput } from 'react-native'

export default class NewThread extends React.Component {
  constructor() {
    super()
    this.state = { message: '' }
  }
  
  render() {
    const { onCreateThread } = this.props
    const { message } = this.state

    return (<View style={{ width: '100%', height: '100%' }}>
      <TextInput 
        multiline={true}
        numberOfLines={4}
        onChangeText={(message) => this.setState({message})}
        value={message} />
      <Button 
        onPress={() => onCreateThread({ message })}
        title="create"
      />
    </View>)
  }
}
