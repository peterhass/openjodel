import React from 'react'
import { Text } from 'react-native'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import _ from 'lodash'
import StreamSelection from './StreamSelection'
import Settings from '../utils/Settings'
import { StackActions, NavigationActions } from 'react-navigation'

const GET_STREAMS = gql`
query GetAllStreams {
  streams {
    id
    name
    insertedAt 
  }
}
`
export default class StreamSelectionContainer extends React.Component {
  constructor() {
    super()

    this.setHomeStream = this.setHomeStream.bind(this)
  }
  render() {
    return (
      <Query query={GET_STREAMS}>
        {({ loading, error, data, subscribeToMore, fetchMore, networkStatus }) => {
          if (loading) return "Loading ..."
          if (error) return `Error! ${error.message}`

          const { streams } = data

          return (
            <StreamSelection
              streams={streams}
              onOpenStream={this.setHomeStream}
              onNavigateNewStream={() => this.props.navigation.navigate('NewStream')}
            />
          )
        }}
      </Query>
    )
  }

  async setHomeStream({ id }) {
    await Settings.homeStreamId.setAsync(id)

    const backAction = NavigationActions.back({})
    this.props.navigation.dispatch(backAction)  
  }
}
