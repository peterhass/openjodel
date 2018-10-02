import React from 'react'
import { View, Text, FlatList, Button, StyleSheet } from 'react-native'
import Moment from 'react-moment'
import Post from './Post'
import NewPost from './NewPost'

export default class Thread extends React.Component {
  render() {

    const { thread, posts, onPostVoting, onCreatePost, onLoadMore } = this.props

    return (
      <View style={{ width: '100%', height: '100%' }}>
        <FlatList
          data={posts}
          renderItem={this.rowRenderer.bind(this)}
          keyExtractor={post => post.id}
          onEndReached={this.loadMoreRows.bind(this)}

          ListHeaderComponent={this.threadPostRenderer(thread)}
        />
        <NewPost
          onCreatePost={onCreatePost}
        />
      </View>
    )
  }

  threadPostRenderer(thread) {
    const { onPostVoting } = this.props

    return (
      <View style={{marginBottom: 5}}>
        <Post
        { ...thread }
        onUpvote={() => onPostVoting(thread.id, 1)}
        onDownvote={() => onPostVoting(thread.id, -1)}
        onResetVote={() => onPostVoting(thread.id, 0)}
      />
    </View>)
  }

  rowRenderer({item: post}) {
    const { onPostVoting } = this.props
    
    return (<Post
      {...post}
      onUpvote={() => onPostVoting(post.id, 1)}
      onDownvote={() => onPostVoting(post.id, -1)}
      onResetVote={() => onPostVoting(post.id, 0)}


    />)
  }

  loadMoreRows() {
    this.props.onLoadMore()
  }
}
