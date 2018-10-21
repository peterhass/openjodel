import React from 'react'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import NewStream from './NewStream'

export default class NewStreamContainer extends React.Component {
  static navigationOptions = NewStream.navigationOptions

  constructor() {
    super()

  }

  render() {
    return (
      <NewStream
        navigation={this.props.navigation}
      />
    )
  }
}
