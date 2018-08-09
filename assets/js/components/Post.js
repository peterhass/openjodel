import React from 'react'
import { Link } from 'react-router-dom'


// TODO: extract linking of threads

const Post = ({ message, insertedAt, id }) => (
  <div>
    <h3>{ insertedAt.toString() }</h3>
    <p>{ message }</p>
    <p><Link to={`/threads/${id}`}>Comments</Link></p>
  </div>
)

export default Post
