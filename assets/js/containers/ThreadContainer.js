import React from 'react'
import Thread from '../components/Thread.js'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'

const FIND_THREAD = gql`
 query Thread($id: String!) {
   thread(id: $id) {
    id
    message
    votingScore
    currentUserVotingScore
    insertedAt
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

const THREAD_SUBSCRIPTION = gql`
subscription onThreadChanged($postId: ID) {
  threadChanged(postId: $postId) {
    id
    message
    votingScore
    currentUserVotingScore
    insertedAt
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

const ThreadContainer = ({match}) => (
  <Query query={FIND_THREAD} variables={{id: match.params.threadId}}>
    {({ loading, error, data, subscribeToMore }) => {
      if (loading) return "Loading ..."
      if (error) return `Error! ${error.message}`

      return (
        <Mutation mutation={VOTE_POST_MUTATION}>
          {mutation => (
            <Thread
              thread={data.thread}
              posts={data.thread.children}
              onPostVoting={(postId, score) => mutation({variables: {id: postId, score: score}})}
              subscribeToPostChanges={() => {
                subscribeToMore({
                  document: THREAD_SUBSCRIPTION,
                  variables: { postId: match.params.threadId },
                  updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev
                    
                    return Object.assign({}, prev, { thread: subscriptionData.data.threadChanged })
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

export default ThreadContainer
