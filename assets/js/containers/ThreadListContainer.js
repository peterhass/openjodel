import React from 'react'
import ThreadList from '../components/ThreadList'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'

const CommentLink = ({ threadId, children, ...linkProps }) => (
  <Link to={`/threads/${threadId}`} {...linkProps}>{children}</Link>
)

const GET_THREADS = gql`
 {
  threads {
    id
    message
    insertedAt
    votingScore
    children {
      id
      message
      votingScore
      insertedAt
    }
  }
}

` // TODO: add filter for parentId is null

const VOTE_POST_MUTATION = gql`
  mutation VotePost($id: ID, $score: Int) {
    votePost(id: $id, score: $score) {
      id
      message
      votingScore
      insertedAt
      children {
        id
        message
        votingScore
        insertedAt
      }
    }

  }
`

const ThreadListContainer = ({}) => (
  <Query query={GET_THREADS}>
    {({ loading, error, data }) => {
      if (loading) return "Loading ..."
      if (error) return `Error! ${error.message}`

      return (
       <Mutation mutation={VOTE_POST_MUTATION}>
          {mutation => (

            <ThreadList 
              threads={data.threads} 
              CommentLink={CommentLink}
              onPostVoting={(postId, score) => mutation({variables: {id: postId, score: score}})}
            />

          )}
        </Mutation>
      )
    }}
  </Query>
)

export default ThreadListContainer
