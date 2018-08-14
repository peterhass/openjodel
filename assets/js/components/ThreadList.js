import React from 'react'
import Post from './Post'

const ThreadList = ({ threads, onPostVoting, CommentLink }) => (
  <div className="thread-list openjodel-list row">
    <div className="col-12 screen-heading">
      <h1>Threads</h1>
    </div>
    <div className="col-12 list-group list-unstyled">
      {threads.map(thread =>
        <div className="list-group-item green">
          <div className="row">  
            <Post
              key={thread.id}
              {...thread}
              onUpvote={() => onPostVoting(thread.id, 1)}
              onDownvote={() => onPostVoting(thread.id, -1)}
              CommentLink={CommentLink}
            />
          </div>
        </div>
      )}
    </div>
  </div>
)

export default ThreadList
