import React from 'react'
import { View, Text, FlatList, TouchableHighlight, StyleSheet } from 'react-native'
import Post from '../components/Post'
import { Ionicons } from '@expo/vector-icons'

export default class ThreadList extends React.Component {
  constructor() {
    super()

    this.state = { isLoading: false }
  }

  componentDidMount() {
    this.props.subscribeToThreadsChanges()
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


    console.log('loadMoreRows', { isLoading: this.state.isLoading })
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
