import React from 'react'
import ThreadList, { EmptyStream } from './ThreadList'
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

const VOTE_POST_MUTATION = gql`
  mutation VotePost($id: ID, $score: Int) {
    votePost(id: $id, score: $score) {
      id
      message
      votingScore
      insertedAt
      currentUserVotingScore
    }

  }
`

const THREAD_ADDED_SUBSCRIPTION = gql`
  subscription onThreadAdded($id: ID) {
    streamThreadAdded(streamId: $id) {
      id
      message
      insertedAt
      votingScore
      currentUserVotingScore
      parentId 
      imageUrl
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
`

const THREAD_CHANGES_SUBSCRIPTION = gql`
  subscription onThreadChanges($id: ID) {
    streamThreadChanged(streamId: $id) {
      id
      message
      insertedAt
      votingScore
      currentUserVotingScore
      imageUrl
      parentId 
    }
  }
`

export default class ThreadListContainer extends React.Component {
  static navigationOptions = ThreadList.navigationOptions


  constructor() {
    super()
    this.state = { streamId: null }
    
    this.setStreamId = (newStreamId) => this.setState({ streamId: newStreamId })
    this.setStreamId = (newStreamId) => {console.log('new stream id: ', newStreamId); this.setState({ streamId: newStreamId })} 
  }
  
  componentDidMount() {
    Settings.homeStreamId.subscribe(this.setStreamId, true)
  }

  componentWillUnmount() {
    Settings.homeStreamId.unsubscribe(this.setStreamId)
  }
  
  render() {
    const props = this.props
    const { streamId } = this.state

    if (streamId === null || streamId === undefined)
      return (<EmptyStream
          navigation={props.navigation}
        />)

    return (
    <Query query={GET_STREAM} variables={{ id: streamId, cursor: { limit: 20 } }} fetchPolicy={'network-only'}>
      {({ loading, error, data, stale, subscribeToMore, fetchMore, networkStatus }) => {
        if (loading) return "Loading ..."
        if (error) return `Error! ${error.message}`
        const { stream } = data
        const { stream: { posts: { posts, cursor } } } = data

        return (
         <Mutation mutation={VOTE_POST_MUTATION}>
            {votingMutation => (

              <ThreadList 
                navigation={props.navigation}
                threads={posts}
                stream={stream}
                onNavigateComments={(threadId) => props.navigation.navigate('Thread', { id: threadId })}
                onNavigateNewThread={() => props.navigation.navigate('NewThread')}
                onPostVoting={(...args) => votePostMutation(votingMutation, ...args)}
                onLoadMore={() => {
                  return fetchMore({
                    query: GET_STREAM,
                    variables: { 
                      id: streamId,
                      cursor: {
                        after: cursor.after,
                        limit: 20
                        //before: cursor.before
                      }
                    },
                    updateQuery: (prev, { fetchMoreResult }) => {
                      const prevThreads = prev.stream.posts.posts
                      const fetchedCursor = fetchMoreResult.stream.posts.cursor
                      const fetchedThreads = fetchMoreResult.stream.posts.posts

                      return _.merge({}, prev, {
                        stream: {
                          posts: {
                            cursor: fetchedCursor,
                            posts: _.uniqBy([...prevThreads, ...fetchedThreads], 'id')
                          }
                        }
                      })
                    }
                  })
                }}
                subscribeToThreadsChanges={() => {
                  subscribeToMore({
                    document: THREAD_ADDED_SUBSCRIPTION,
                    variables: { id: streamId },
                    updateQuery: (prev, { subscriptionData }) => {
                      if (!subscriptionData.data) return prev
                      return _.merge({}, prev, {
                        stream: {
                          posts: {
                            posts: _.uniqBy([subscriptionData.data.streamThreadAdded, ...prev.stream.posts.posts], 'id')
                          }
                        }
                      })
                    }
                  })

                  subscribeToMore({
                    document: THREAD_CHANGES_SUBSCRIPTION,
                    variables: { id: streamId },
                    updateQuery: (prev, { subscriptionData }) => {
                      if (!subscriptionData.data) return prev
                      const subscriptionPost = subscriptionData.data.streamThreadChanged

                      return _.merge({}, prev, { 
                        stream: {
                          posts: { 
                            posts: prev.stream.posts.posts.map((post) => (post.id == subscriptionPost.id) ? {...post, ...subscriptionPost} : post)
                          } 
                        }
                      })
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
  }
}

