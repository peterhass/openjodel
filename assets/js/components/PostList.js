import React from 'react'
import Post from './Post'

// TODO: extract linking of threads

const PostList = ({ posts }) => (
  <div>
    {posts.map(post =>
      <Post
        key={post.id}
        {...post}
      />
    )}
  </div>
)

export default PostList
