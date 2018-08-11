import React from 'react'
import ThreadList from '../components/ThreadList'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

const CommentLink = ({ threadId, children, ...linkProps }) => (
  <Link to={`/threads/${threadId}`} {...linkProps}>{children}</Link>
)

const GET_THREADS = gql`
 {
  threads {
    id
    message
    insertedAt
    children {
      id
      message
      insertedAt
    }
  }
}

` // TODO: add filter for parentId is null

const ThreadListContainer = ({}) => (
  <Query query={GET_THREADS}>
    {({ loading, error, data }) => {
      if (loading) return "Loading ..."
      if (error) return `Error! ${error.message}`

      return (
        <ThreadList 
          threads={data.threads} 
          CommentLink={CommentLink}
          onPostVoting={() => {console.log('on posts voting')}} />
      )
    }}
  </Query>
)

export default ThreadListContainer
