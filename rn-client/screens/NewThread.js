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

    return (
    <View style={{ width: '100%', height: '100%' }}>
      <View style={styles.textInputContainer}>
        <TextInput 
          style={styles.textInput}
          multiline={true}
          onChangeText={(message) => this.setState({message})}
          placeholder="What do you want to tell the world?"
          value={message} />
      </View>
    </View>)
  }

  onCreateThread() {
    const { message } = this.state
    
    return this.props.onCreateThread({ message })
  }
}


const styles = StyleSheet.create({
  textInputContainer: {
    height: '100%',
    padding: 10
  },
  textInput: {
    height: '100%',
    backgroundColor: '#e2e2e2',
    borderRadius: 5,
    padding: 10,
    fontSize: 30

  }
})
