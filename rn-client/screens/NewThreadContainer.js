import React, { Component } from 'react'
import NewThread from './NewThread'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import { StackActions, NavigationActions } from 'react-navigation'

const CREATE_THREAD_MUTATION = gql`
mutation CreateThread($message: String, $image: Upload, $latitude: Float, $longitude: Float) {
  createThread(message: $message, image: $image, geog: [$latitude, $longitude]) {
    id
    message
    votingScore
    insertedAt
    currentUserVotingScore
    imageUrl
  }
}
`

class NewThreadContainer extends Component {
  static navigationOptions = NewThread.navigationOptions
  
  constructor() {
    super()
    this.navigateToThread = this.navigateToThread.bind(this)
  }
  
  render() {
    return (
      <Mutation 
        mutation={CREATE_THREAD_MUTATION}
        refetchQueries={['GetStream']}
        onCompleted={({ createThread: thread }) => this.navigateToThread({ thread })}
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

  navigateToThread({ thread }) {
    const setBackToThreadList = () => {
      this.props.navigation.dispatch(StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Home' })
        ]
      }))
    }

    setBackToThreadList()
    this.props.navigation.navigate('Thread', { id: thread.id })
  }
}

export default NewThreadContainer

