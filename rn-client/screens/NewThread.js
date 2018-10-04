import React from 'react'
import { View, Text, FlatList, Button, StyleSheet, TextInput } from 'react-native'

export default class NewThread extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <Button
        onPress={navigation.getParam('onCreateThread') || (() => {})}
        title="Weiter"
      />
    )
  })

  constructor() {
    super()
    this.state = { message: '' }
    this.onCreateThread = this.onCreateThread.bind(this)
  }

  componentDidMount() {
    this.props.navigation.setParams({ onCreateThread: this.onCreateThread })
  }
  
  render() {
    const { message } = this.state

    return (<View style={{ width: '100%', height: '100%' }}>
      <TextInput 
        multiline={true}
        numberOfLines={4}
        onChangeText={(message) => this.setState({message})}
        value={message} />
    </View>)
  }

  onCreateThread() {
    const { message } = this.state
    
    return this.props.onCreateThread({ message })
  }
}
