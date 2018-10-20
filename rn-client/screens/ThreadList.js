import React from 'react'
import { View, Text, Button, FlatList, TouchableHighlight, StyleSheet } from 'react-native'
import Post from '../components/Post'
import { Ionicons } from '@expo/vector-icons'

const StreamHeader = ({ stream, onPress }) => {
  const streamName = stream ? (stream.name || `<${stream.id}>`) : '-'

  return (
    <Button onPress={onPress} title={streamName} />
  )
}

// TODO: find a nicer solution to this empty-stream-problem
export class EmptyStream extends React.Component {

  static navigationOptions = ({ navigation })  => ({
    headerTitle: <StreamHeader stream={null} onPress={() => navigation.navigate('StreamSelection')} />
  })

  render() {
    return (null)
  }
}

export default class ThreadList extends React.Component {
  static navigationOptions = ({ navigation })  => ({
    headerTitle: <StreamHeader stream={navigation.getParam('stream')} onPress={() => navigation.navigate('StreamSelection')} />
  })

  constructor() {
    super()

    this.state = { isLoading: false }
  }

  componentWillMount() {
    this.props.navigation.setParams({ stream: this.props.stream })
  }

  componentDidMount() {
    this.props.subscribeToThreadsChanges()

    this.props.navigation.setParams({ stream: this.props.stream })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.stream !== this.props.stream)
      this.props.navigation.setParams({ stream: this.props.stream })
  }

  render() {
    const { threads, onNavigateNewThread } = this.props
    const { isLoading } = this.state

    return (
      <View style={{ width: '100%', height: '100%' }}>
        <FlatList
          data={threads}
          renderItem={this.rowRenderer.bind(this)}
          keyExtractor={thread => thread.id}
          onEndReached={this.loadMoreRows.bind(this)}


          ItemSeparatorComponent={() => (<View style={{ height: 10, backgroundColor: 'white' }} />)}
        />
        <View style={styles.floatingActionContainer} pointerEvents="box-none">
          <TouchableHighlight onPress={onNavigateNewThread}>
            <Ionicons name="md-add-circle" size={64} color="black" />
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  rowRenderer({item: thread}) {
    const { onPostVoting, onNavigateComments } = this.props

    return (
      <Post
        { ...thread }
        children={thread.children.posts || []}
        onUpvote={() => onPostVoting({ post: thread }, 1)}
        onDownvote={() => onPostVoting({ post: thread }, -1)}
        onResetVote={() => onPostVoting({ post: thread }, 0)}
        onNavigateComments={onNavigateComments}
      />
    )
  }

  loadMoreRows() {


    if (this.state.isLoading) return

    return this.setState({ ...this.state, isLoading: true }, () => {
      return this.props.onLoadMore().then(() => {
        this.setState({ ...this.state, isLoading: false })
      })
    })
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
