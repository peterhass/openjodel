import React from 'react'
import { View, Text, FlatList } from 'react-native'
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
    const { NewThreadLink } = this.props
    //const { threads, isLoading } = this.props
    const { threads } = this.props
    const { isLoading } = this.state

    return (
      <FlatList
        data={threads}
        renderItem={this.rowRenderer.bind(this)}
        keyExtractor={thread => thread.id}
        onEndReached={this.loadMoreRows.bind(this)}
      />
    )
  }

  rowRenderer({item: thread}) {
    const { onPostVoting, CommentLink } = this.props

    return (
      <Post
        { ...thread }
        onUpvote={() => onPostVoting(thread.id, 1)}
        onDownvote={() => onPostVoting(thread.id, -1)}
        onResetVote={() => onPostVoting(thread.id, 0)}
        CommentLink={CommentLink}
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
