import React from 'react'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'


// TODO: extract linking of threads

const Post = ({ message, insertedAt, score, id, children, onUpvote, onDownvote, CommentLink }) => (
  <div className="posting col-12">
    <div className="row">
      <div className="posting-heading col-12">
        <span className="time">
          <i className="fas fa-clock"></i>
          &nbsp;
          <Moment fromNow>{ insertedAt }</Moment>
        </span>
      </div>
      <div className="col-12">
        <div className="row">
          <div className="col-10 posting-body">
            <div className="posting-message">{ message }</div>
          </div>
          <div className="col-2">
            <div className="pull-right voting">
              <i className="fas fa-chevron-circle-up fa-lg" onClick={onUpvote}></i>
              <span className="counter">{ score }</span>
              <i className="fas fa-chevron-circle-down fa-lg" onClick={onDownvote}></i>
            </div>
          </div>
        </div>
      </div>
      <div className="posting-footer col-12">
        { CommentLink &&
          <CommentLink className="btn btn-primary" threadId={id}>
            <i className="fas fa-comments"></i>
            &nbsp;<span className="badge badge-light">{children.length}</span>
          </CommentLink>
        }
      </div>
    </div>
  </div>
)

export default Post
