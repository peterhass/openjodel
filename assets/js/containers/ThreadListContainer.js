import React from 'react'
import ThreadList from '../components/ThreadList'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { votePost } from '../actions/posts'

const CommentLink = ({ threadId, children, ...linkProps }) => (
  <Link to={`/threads/${threadId}`} {...linkProps}>{children}</Link>
)

const mapStateToProps = (state, ownProps) => ({
  threads: state.posts.threadIds.map(threadId => state.posts.byId[threadId]),
  CommentLink
})

const mapDispatchToProps = dispatch => ({
  onPostVoting: (id, score) => dispatch(votePost({ id, score }))
})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThreadList)
