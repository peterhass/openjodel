import React from 'react'
import { 
  View, 
  ScrollView,
  Text, 
  FlatList, 
  Button, 
  KeyboardAvoidingView,
  StyleSheet } from 'react-native'
import Moment from 'react-moment'
import Post from '../components/Post'
import NewPost from '../components/NewPost'

export default class Thread extends React.Component {
  constructor() {
    super()
  }

  render() {

    const { thread, posts, onPostVoting, onCreatePost, onLoadMore } = this.props

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.listContainer}>
          <FlatList
            style={styles.list}
            data={posts}
            renderItem={this.rowRenderer.bind(this)}
            keyExtractor={post => post.id}
            onEndReached={this.loadMoreRows.bind(this)}

            ListHeaderComponent={this.threadPostRenderer(thread)}
          />
        </View>
        <View style={styles.newPostContainer}>
          <NewPost onCreatePost={onCreatePost} />
        </View>
      </KeyboardAvoidingView>
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

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
  },

  listContainer: {
    flex: 1
  },

  newPostContainer: {
    flex: 0,
    minHeight: 64,
    maxHeight: 128
  }
})
