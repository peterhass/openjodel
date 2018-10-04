import React from 'react'
import Thread from './Thread.js'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import _ from 'lodash'

const FIND_THREAD = gql`
 query Thread($id: String!, $cursor: CursorInput) {
   thread(id: $id) {
     id
     message
     insertedAt
     votingScore
     currentUserVotingScore
     parentId
     children(cursor: $cursor) {
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

         participant {
           name
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


const POST_CHANGES_SUBSCRIPTION = gql`
subscription onPostChanged($threadId: ID) {
  threadPostChanges(threadId: $threadId) {
    id
    message
    votingScore
    parentId
    insertedAt
    currentUserVotingScore

    participant {
      name
    }
  }
}
`

const POST_ADDED_SUBSCRIPTION = gql`
subscription onPostAdded($threadId: ID) {
  postAdded(threadId: $threadId) {
    id
    message
    votingScore
    parentId
    insertedAt
    currentUserVotingScore

    participant {
      name
    }
  }
}
`

const CREATE_POST_MUTATION = gql`
mutation CreatePost($message: String, $parentId: ID) {
  createPost(message: $message, parentId: $parentId) {
    id
    message
    votingScore
    parentId
    insertedAt
    currentUserVotingScore

    participant {
      name
    }
  }
}
`

const ThreadContainer = ({navigation}) => (
  <Query
    query={FIND_THREAD}
    variables={{
      id: navigation.getParam('id'),
      cursor: {
        limit: 9
      }
      
    }}>
    {({ loading, error, data, subscribeToMore, fetchMore }) => {
      if (loading) return "Loading ..."
      if (error) return `Error! ${error.message}`

      return (
        <Mutation 
          mutation={CREATE_POST_MUTATION}
          refetchQueries={['Thread']}
        >
        {createPostMutation => (
          <Mutation mutation={VOTE_POST_MUTATION}>
            {mutation => (
              <Thread
                thread={data.thread}
                posts={data.thread.children.posts}
                onPostVoting={(postId, score) => mutation({variables: {id: postId, score: score}})}
                onCreatePost={({message}) => createPostMutation({variables: {message, parentId: data.thread.id}})}
                onLoadMore={() => {
                  return fetchMore({
                    query: FIND_THREAD,
                    variables: { 
                      id: navigation.getParam('id'),
                      cursor: {
                        after: data.thread.children.cursor.after,
                        limit: 20
                        //before: cursor.before
                      }
                    },
                    updateQuery: (prev, { fetchMoreResult }) => {

                      return Object.assign({}, prev, {
                        thread: Object.assign({}, prev.thread, {
                          children: Object.assign({}, prev.thread.children, {
                            cursor: fetchMoreResult.thread.children.cursor,
                            posts: _.uniqBy([...prev.thread.children.posts, ...fetchMoreResult.thread.children.posts], 'id')
                          })
                        })
                      })
                    }
                  })
                }}

                subscribeToPostChanges={() => {
                  subscribeToMore({
                    document: POST_CHANGES_SUBSCRIPTION,
                    variables: { threadId: navigation.getParam('id') },
                    updateQuery: (prev, { subscriptionData }) => {
                      if (!subscriptionData.data) return prev

                      const subscriptionPost = subscriptionData.data.threadPostChanges


                      return _.merge({}, prev, {
                        thread: {
                          children: {
                            posts: prev.thread.children.posts.map((post) => (post.id == subscriptionPost.id) ? subscriptionPost : post)
                          }
                        }
                      })
                    }
                  })

                  subscribeToMore({
                    document: POST_ADDED_SUBSCRIPTION,
                    variables: { threadId: navigation.getParam('id') },
                    updateQuery: (prev, { subscriptionData }) => {
                      if (!subscriptionData.data) return prev

                      const subscriptionPost = subscriptionData.data.postAdded

                      return _.merge({}, prev, {
                        thread: {
                          children: {
                            posts: [...prev.thread.children.posts, subscriptionPost]
                          }
                        }
                      })
                    }
                  })
                }}
              />
            )}
          </Mutation>
        
        )}
      </Mutation>
      )
    }}
  </Query>
)

export default ThreadContainer

