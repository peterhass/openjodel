import React from 'react'
import { 
  View, 
  ActivityIndicator,
  TextInput, 
  Text,
  Button, 
  StyleSheet, 
  TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ImagePicker, Permissions, Location } from 'expo'
import { ReactNativeFile } from '../utils/ReactNativeFile'

export default class NewPost extends React.Component {
  constructor() {
    super()
    this.state = { message: '', postingInProgress: false }

    this.inputRef = React.createRef()
    this.onSend = this.onSend.bind(this)
    this.onAttachImage = this.onAttachImage.bind(this)
  }


  render() {
    const { message, postingInProgress } = this.state
    const { onCreatePost } = this.props

    if (postingInProgress) {
      return (
        <View style={styles.box}>

          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" style={{ marginBottom: 10 }} />
            <Text>Shouting your message into the internet ...</Text>
          </View>
        </View>
      )
    }

    return (<View style={styles.box}>
      <TextInput
        ref={this.inputRef}
        placeholder="What do you want to tell the world?"
        onChangeText={(message) => this.setState({message})}
        value={message}
        style={styles.text}
        multiline={true}
      />
      <View style={styles.buttonBox}>
        <TouchableOpacity
          style={styles.button}
          onPress={this.onAttachImage}
        >
          <Ionicons name="md-camera" size={32} color="green" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={this.onSend}
        >
          <Ionicons name="md-arrow-dropright-circle" size={32} color="green" />
        </TouchableOpacity>
      </View>
    </View>)
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


    await this.props.onCreatePost({ image: file, latitude, longitude })

    this.setState({ message: '', postingInProgress: false }, () => {
      this.inputRef.current.blur()
    })
  }

  async getLocationAsync() {
    await Permissions.askAsync(Permissions.LOCATION)
    return await Location.getCurrentPositionAsync({})
  }


  async onSend() {
    const { message } = this.state
    this.setState({ ...this.state, postingInProgress: true })
    
    const location = await this.getLocationAsync()
    const { coords: { latitude, longitude } } = location

    return this.props.onCreatePost({ message, latitude, longitude }).then(() => {
      this.setState({ message: '', postingInProgress: false }, () => {
        this.inputRef.current.blur()
      })
    })

  }
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    borderWidth: 1,
    borderColor: 'silver',
    padding: 10,
  },

  text: {
    flex: 1,
    backgroundColor: '#e2e2e2',
    padding: 10,
    borderRadius: 5
  },

  buttonBox: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 5
  }
})
