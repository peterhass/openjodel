import React from 'react'
import { View, Text, FlatList, TouchableHighlight } from 'react-native'
import Post from './Post'

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
        <TouchableHighlight onPress={onNavigateNewThread}>
          <Text>+</Text>
        </TouchableHighlight>
        <FlatList
          data={threads}
          renderItem={this.rowRenderer.bind(this)}
          keyExtractor={thread => thread.id}
          onEndReached={this.loadMoreRows.bind(this)}


          ItemSeparatorComponent={() => (<View style={{ height: 10, backgroundColor: 'white' }} />)}
        />
      </View>
    )
  }

  rowRenderer({item: thread}) {
    const { onPostVoting, onNavigateComments } = this.props

    return (
      <Post
        { ...thread }
        children={thread.children.posts || []}
        onUpvote={() => onPostVoting(thread.id, 1)}
        onDownvote={() => onPostVoting(thread.id, -1)}
        onResetVote={() => onPostVoting(thread.id, 0)}
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
