import React from 'react'
import Thread from '../components/Thread.js'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

const FIND_THREAD = gql`
 query Thread($id: String!) {
   thread(id: $id) {
    id
    message
    insertedAt
    children {
      id
      message
      insertedAt
    }
  }
}

`

const ThreadContainer = ({match}) => (
  <Query query={FIND_THREAD} variables={{id: match.params.threadId}}>
    {({ loading, error, data }) => {
      if (loading) return "Loading ..."
      if (error) return `Error! ${error.message}`

      return (
        <Thread
          thread={data.thread}
          posts={data.thread.children}
          onPostVoting={() => { console.log('on post voting') }}
        />
      )
    }}
  </Query>
)

export default ThreadContainer
