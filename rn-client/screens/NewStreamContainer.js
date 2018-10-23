import React from 'react'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import NewStream from './NewStream'
import Settings from '../utils/Settings'
import { StackActions, NavigationActions } from 'react-navigation'

const CREATE_STREAM_MUTATION = gql`
mutation CreateStream($name: String, $latitude: Float, $longitude: Float) {
  createStream(name: $name, geog: [$latitude, $longitude]) {
    id
    name
  }
}
`

export default class NewStreamContainer extends React.Component {
  static navigationOptions = NewStream.navigationOptions

  constructor() {
    super()

    this.setAndOpenStream = this.setAndOpenStream.bind(this)
  }

  render() {
    return (
      <Mutation 
        mutation={CREATE_STREAM_MUTATION}
        refetchQueries={['GetAllStreams']}
        onCompleted={({ createStream: stream }) => this.setAndOpenStream({ stream })}
      >
        {mutation => (
          <NewStream
            navigation={this.props.navigation}
            onCreateStream={(attrs) => mutation({variables: attrs})}
          />
        )}
      </Mutation>
    )
  }

  async setAndOpenStream({ stream: { id } }) {
    await Settings.homeStreamId.setAsync(id)

    this.props.navigation.dispatch(StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Home' })
      ]
    }))

    this.props.navigation.navigate('Home')
  }
}
