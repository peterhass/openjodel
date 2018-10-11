import React from 'react'
import { View, Text, FlatList, Button, StyleSheet, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ImagePicker, Permissions } from 'expo'
import { ReactNativeFile } from '../utils/ReactNativeFile'

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
    this.onAttachImage = this.onAttachImage.bind(this)
  }

  componentDidMount() {
    this.props.navigation.setParams({ onCreateThread: this.onCreateThread })
  }
  
  render() {
    const { message } = this.state

    return (
    <KeyboardAvoidingView style={{ width: '100%', height: '100%' }}>
      <View style={styles.textInputContainer}>
        <TextInput 
          style={styles.textInput}
          multiline={true}
          onChangeText={(message) => this.setState({message})}
          placeholder="What do you want to tell the world?"
          value={message} />
      </View>
      <View style={styles.actionButtonContainer}>
        <TouchableOpacity onPress={this.onAttachImage}>
          <Ionicons name="md-camera" size={32} color="blue" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>)
  }

  onCreateThread() {
    const { message } = this.state
    
    return this.props.onCreateThread({ message })
  }

  async onAttachImage() { 
    await Promise.all([
      await Permissions.askAsync(Permissions.CAMERA_ROLL),
      await Permissions.askAsync(Permissions.CAMERA)
    ])

    const response = await ImagePicker.launchCameraAsync({
      compress: 0.8,
      exif: true
    }) 

    const file = new ReactNativeFile({
      name: "img",
      uri: response.uri,
      type: response.type
    })

    return this.props.onCreateThread({ image: file })
  }
}


const styles = StyleSheet.create({
  textInputContainer: {
    flex: 1,
    padding: 10
  },
  actionButtonContainer: {
    flex: 0,
    minHeight: 64,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  textInput: {
    height: '100%',
    backgroundColor: '#e2e2e2',
    borderRadius: 5,
    padding: 10,
    fontSize: 30

  }
})
