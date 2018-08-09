import React from 'react'
import PostList from '../components/PostList'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  posts: state.posts.threadIds.map(threadId => state.posts.byId[threadId])
})

const mapDispatchToProps = dispatch => ({

})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostList)
