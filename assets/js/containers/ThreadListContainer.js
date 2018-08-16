import React from 'react'
import ThreadList from '../components/ThreadList'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'

const CommentLink = ({ threadId, children, ...linkProps }) => (
  <Link to={`/threads/${threadId}`} {...linkProps}>{children}</Link>
)

const NewThreadLink = ({ children, ...linkProps }) => (
  <Link to="/threads/new" {...linkProps}>{children}</Link>
)

const GET_THREADS = gql`
 query GetThreads {
  threads {
    id
    message
    insertedAt
    votingScore
    currentUserVotingScore
    parentId
    children {
      id
      message
      votingScore
      currentUserVotingScore
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
      currentUserVotingScore
      children {
        id
        message
        votingScore
        currentUserVotingScore
        insertedAt
      }
    }

  }
`

const THREADS_SUBSCRIPTION = gql`
subscription onThreadsChanged {
  threadsChanged {
    id
    message
    votingScore
    currentUserVotingScore
    insertedAt
    parentId
    children {
      id
      message
      parentId
      votingScore
      currentUserVotingScore
      insertedAt
    }

  }
}
`


const ThreadListContainer = ({}) => (
  <Query query={GET_THREADS}>
    {({ loading, error, data, subscribeToMore }) => {
      if (loading) return "Loading ..."
      if (error) return `Error! ${error.message}`

      return (
       <Mutation mutation={VOTE_POST_MUTATION}>
          {votePostMutation => (

            <ThreadList 
              threads={data.threads} 
              CommentLink={CommentLink}
              NewThreadLink={NewThreadLink}
              onPostVoting={(postId, score) => votePostMutation({variables: {id: postId, score: score}})}
              subscribeToThreadsChanges={() => {
                subscribeToMore({
                  document: THREADS_SUBSCRIPTION,
                  updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev

                    return Object.assign({}, prev, { threads: subscriptionData.data.threadsChanged })
                  }
                })
              }}
            />

          )}
        </Mutation>
      )
    }}
  </Query>
)

export default ThreadListContainer
