import React from 'react'
import { ActivityIndicator, Modal, View, Text, FlatList, Button, StyleSheet, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ImagePicker, Permissions, Location } from 'expo'
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
    this.state = { message: '', postingInProgress: false }
    this.onCreateThread = this.onCreateThread.bind(this)
    this.onAttachImage = this.onAttachImage.bind(this)
  }

  componentDidMount() {
    this.props.navigation.setParams({ onCreateThread: this.onCreateThread })
  }
  
  render() {
    const { message, postingInProgress } = this.state

    return (
    <KeyboardAvoidingView style={{ height: '100%', flex: 1 }}  behavior="padding">
      <Modal
        visible={postingInProgress}
        animationType="slide"
      >
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" style={{ marginBottom: 10 }} />
           <Text>Shouting your message into the internet ...</Text>
        </View>
      </Modal>
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

  async onCreateThread() {
    this.setState({ ...this.state, postingInProgress: true })
    const { message } = this.state
    console.log('waiting for location ...')
    const location = await this.getLocationAsync()
    console.log('got location')
    const { coords: { latitude, longitude } } = location

    console.log(location)
    return this.props.onCreateThread({ message, latitude, longitude }).then(() => {
      //looks like this is not nessecary because we navigate away from this screen
      //this.setState({ ...this.state, postingInProgress: false })
    })
  }

  async getLocationAsync() {
    await Permissions.askAsync(Permissions.LOCATION)

    return await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { maximumAge: 20 * 60 * 1000, timeout: 10*100 }))
  }

  async onAttachImage() { 
    const response = await ImagePicker.launchCameraAsync({
      compress: 0.8,
      exif: true
    }) 

    if(response.cancelled)
      return

    this.setState({ ...this.state, postingInProgress: true })

    await Promise.all([
      await Permissions.askAsync(Permissions.CAMERA_ROLL),
      await Permissions.askAsync(Permissions.CAMERA)
    ])


    const file = new ReactNativeFile({
      name: "img",
      uri: response.uri,
      type: response.type
    })

    const location = await this.getLocationAsync()
    const { coords: { latitude, longitude } } = location

    console.log({latitude, longitude})
    return this.props.onCreateThread({ image: file, latitude, longitude }).then(() => {
      //looks like this is not nessecary because we navigate away from this screen
      //this.setState({ ...this.state, postingInProgress: false })
    })
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
    flex: 1,
    backgroundColor: '#e2e2e2',
    borderRadius: 5,
    padding: 10,
    fontSize: 30

  }
})
