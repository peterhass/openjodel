import React from 'react'
import { View, TextInput, Button, StyleSheet } from 'react-native'

export default class NewPost extends React.Component {
  constructor() {
    super()
    this.state = { message: '' }
  }


  render() {
    const { message } = this.state
    const { onCreatePost } = this.props

    return (<View style={styles.box}>
      <TextInput
        placeholder="What do you want to tell the world?"
        onChangeText={(message) => this.setState({message})}
        value={message}
      />
      <Button
        onPress={() => onCreatePost({message})}
        title="create"
      />
    </View>)
  }
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    flexDirection: 'row'
  }
})
