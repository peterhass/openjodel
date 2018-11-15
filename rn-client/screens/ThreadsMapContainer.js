import React from 'react'
import ThreadsMap from './ThreadsMap'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import _ from 'lodash'
import { votePostMutation } from './ThreadContainer'
import Settings from '../utils/Settings'

const GET_STREAM = gql`
query GetStream($id: ID, $cursor: CursorInput) {
  stream(id: $id) {
    id
    name
    posts(cursor: $cursor) @connection(key: "threads") {
      cursor {
        before
        after
      }
      posts {
        id
        message
        insertedAt
        votingScore
        currentUserVotingScore
        parentId
        imageUrl
        anonymizedGeog {
          coordinates
        }
        children {
          cursor {
            before
            after
          }
          posts {
            id
            message
            votingScore
            currentUserVotingScore
            insertedAt
          }
        }
      }
    }

  }
}
`


export default class ThreadsMapContainer extends React.Component {
  static navigationOptions = ThreadsMap.navigationOptions

  constructor() {
    super()

    this.state = { streamId: null }
    this.setStreamId = (streamId) => this.setState({ ...this.state, streamId })
  }

  componentDidMount() {
    Settings.homeStreamId.subscribe(this.setStreamId, true)
  }

  componentWillMount() {
    Settings.homeStreamId.unsubscribe(this.setStreamId)
  }

  render() {

    const { streamId } = this.state

    if (streamId === null || streamId === undefined)
      return (<ThreadsMap threads={[]} />)

    return (
      <Query query={GET_STREAM} variables={{ id: streamId, cursor: { limit: 20 } }}>
        {({ data }) => {
          const { stream: { posts: { posts, cursor } } } = data

          return (
            <ThreadsMap
              navigation={this.props.navigation}
              threads={posts}
            />
          )
        }}
      </Query>
    )
  }
}
