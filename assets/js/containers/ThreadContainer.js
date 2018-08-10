import React from 'react'
import { connect } from 'react-redux'
import Thread from '../components/Thread.js'
import { votePost } from '../actions/posts'

const mapStateToProps = (state, ownProps) => {
  const thread = state.posts.byId[ownProps.match.params.threadId]
  return {
    thread,
    posts: thread.childrenIds.map(childId => state.posts.byId[childId])
  }
}


const mapDispatchToProps = dispatch => ({
  onPostVoting: (id, score) => dispatch(votePost({ id, score }))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps

)(Thread)
