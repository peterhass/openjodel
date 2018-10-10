import React from 'react'
import { 
  View, 
  TextInput, 
  Button, 
  StyleSheet, 
  TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ImagePicker, Permissions } from 'expo'
import { ReactNativeFile } from '../utils/ReactNativeFile'

export default class NewPost extends React.Component {
  constructor() {
    super()
    this.state = { message: '' }

    this.inputRef = React.createRef()
    this.onSend = this.onSend.bind(this)
    this.onAttachImage = this.onAttachImage.bind(this)
  }


  render() {
    const { message } = this.state
    const { onCreatePost } = this.props

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

    await this.props.onCreatePost({ image: file })

    this.setState({ message: '' }, () => {
      this.inputRef.current.blur()
    })
  }


  onSend() {
    const { message } = this.state
    
    return this.props.onCreatePost({ message }).then(() => {
      this.setState({ message: '' }, () => {
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
