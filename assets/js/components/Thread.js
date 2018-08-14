import React from 'react'
import Post from './Post'

const Thread = ({ thread, posts, onPostVoting }) => (
  <div className="single-thread openjodel-list row">
    <div className="col-12 screen-heading">
      <h1>THREAD</h1>
    </div>
    <div className="col-12 list-group list-unstyled">
      <div className="list-group-item green thread-item">
        <div className="row">
          <Post 
            key={thread.id} 
            {...thread} 
            onUpvote={() => onPostVoting(thread.id, 1)}
            onDownvote={() => onPostVoting(thread.id, -1)}
            onResetVote={() => onPostVoting(thread.id, 0)}

          />
        </div>
      </div>
      {posts.map(post =>
        <div className="list-group-item green">
          <div className="row">  
            <Post
              key={post.id}
              onUpvote={() => onPostVoting(post.id, 1)}
              onDownvote={() => onPostVoting(post.id, -1)}
              onResetVote={() => onPostVoting(post.id, 0)}
              {...post}
            />
          </div>
        </div>
      )}
    </div>
  </div>
)

export default Thread
