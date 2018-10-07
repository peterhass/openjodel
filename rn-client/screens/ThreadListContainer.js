import React from 'react'
import ThreadList from './ThreadList'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import _ from 'lodash'
import { votePostMutation } from './ThreadContainer'


const GET_THREADS = gql`
 query GetThreads($cursor: CursorInput) {
  threads(cursor: $cursor) @connection(key: "threads") {
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
  subscription onThreadAdded {
    threadAdded {
      id
      message
      insertedAt
      votingScore
      currentUserVotingScore
      parentId 
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
  subscription onThreadChanges {
    threadChanges {
      id
      message
      insertedAt
      votingScore
      currentUserVotingScore
      parentId 
    }
  }
`


const ThreadListContainer = (props) => (
  <Query 
    query={GET_THREADS}
    variables={{
      cursor: {
        limit: 20
      }
    }}
  >
    {({ loading, error, data, subscribeToMore, fetchMore, networkStatus }) => {
      if (loading) return "Loading ..."
      if (error) return `Error! ${error.message}`

      const { threads: { posts, cursor } } = data

      return (
       <Mutation mutation={VOTE_POST_MUTATION}>
          {votingMutation => (

            <ThreadList 
              threads={posts}
              onNavigateComments={(threadId) => props.navigation.navigate('Thread', { id: threadId })}
              onNavigateNewThread={() => props.navigation.navigate('NewThread')}
              onPostVoting={(...args) => votePostMutation(votingMutation, ...args)}
              onLoadMore={() => {
                return fetchMore({
                  query: GET_THREADS,
                  variables: { 
                    cursor: {
                      after: cursor.after,
                      limit: 20
                      //before: cursor.before
                    }
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    const prevThreads = prev.threads.posts
                    const fetchedCursor = fetchMoreResult.threads.cursor
                    const fetchedThreads = fetchMoreResult.threads.posts


                    return Object.assign({}, prev, {
                      threads: Object.assign({}, prev.threads, {
                        cursor: fetchedCursor,
                        posts: _.uniqBy([...prevThreads, ...fetchedThreads], 'id')
                      })
                    })
                  }
                })
              }}
              subscribeToThreadsChanges={() => {
                subscribeToMore({
                  document: THREAD_ADDED_SUBSCRIPTION,
                  updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev
                    return _.merge({}, prev, {
                      threads: {
                        posts: [subscriptionData.data.threadAdded, ...prev.threads.posts]
                      }
                    })
                  }
                })

                subscribeToMore({
                  document: THREAD_CHANGES_SUBSCRIPTION,
                  updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev

                    const subscriptionPost = subscriptionData.data.threadChanges

                    return _.merge({}, prev, { 
                      threads: { 
                        posts: prev.threads.posts.map((post) => (post.id == subscriptionPost.id) ? {...post, ...subscriptionPost} : post)
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

export default ThreadListContainer

