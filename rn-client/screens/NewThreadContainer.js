import React, { Component } from 'react'
import NewThread from './NewThread'
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
  static navigationOptions = NewThread.navigationOptions
  
  render() {
    return (
      <Mutation 
        mutation={CREATE_THREAD_MUTATION}
        refetchQueries={['GetThreads']}
        onCompleted={({ createThread: thread }) => {
          this.props.navigation.navigate('Thread', { id: thread.id })
        }}
      >
        {mutation => (
          <NewThread
            onCreateThread={(threadAttrs) => mutation({variables: threadAttrs})}
            navigation={this.props.navigation}
          />
        )}
      </Mutation>
    )
  }
}

export default NewThreadContainer

