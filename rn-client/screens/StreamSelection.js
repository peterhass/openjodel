import React from 'react'
import { View, Text, Button, FlatList, TouchableHighlight, StyleSheet } from 'react-native'
import Post from '../components/Post'
import { Ionicons } from '@expo/vector-icons'

export default class StreamSelection extends React.Component {
  static navigationOptions = ({ navigation })  => ({
  })

  constructor() {
    super()
  }

  render() {
    const { streams, onOpenStream, onNavigateNewStream } = this.props

    return (
      <View style={{ width: '100%', height: '100%' }}>
        <FlatList
          data={streams}
          renderItem={({ item: stream }) => (
            <Button title={stream.name} onPress={() => onOpenStream(stream)} />
          )}          
          keyExtractor={stream => stream.id}
         />
        <View style={styles.floatingActionContainer} pointerEvents="box-none">
          <TouchableHighlight onPress={onNavigateNewStream}>
            <Ionicons name="md-add-circle" size={64} color="black" />
          </TouchableHighlight>
        </View>
      </View>
    )
  }

}


const styles = StyleSheet.create({
  floatingActionContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.6
  }
})

