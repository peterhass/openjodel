import React, { Component } from 'react'
import NewThread from '../components/NewThread'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'

const CREATE_THREAD_MUTATION = gql`
mutation CreateThread($message: String) {
  createThread(message: $message) {
    id
    message
    votingScore
    insertedAt
    currentUserVotingScore
    
  }
}
`

class NewThreadContainer extends Component {
  render() {
    return (
      <Mutation 
        mutation={CREATE_THREAD_MUTATION}
        refetchQueries={['GetThreads']}
        onCompleted={({ createThread: thread }) => {
          console.log(thread)
          this.props.history.push(`/threads/${thread.id}`)
        }}
      >
        {mutation => (
          <NewThread
            onCreateThread={(threadAttrs) => mutation({variables: threadAttrs})}
          />
        )}
      </Mutation>
    )
  }
}

export default NewThreadContainer
