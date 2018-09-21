import React from 'react'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'


// TODO: extract linking of threads

const Post = ({ message, insertedAt, votingScore, currentUserVotingScore: currentVote, participant, id, children, onResetVote, onUpvote, onDownvote, CommentLink }) => {
  const { name: participantName } = participant || {}

  return (
  <div className="posting col-12">
    <div className="row">
      <div className="posting-heading col-12">
        { participantName &&
          <span className="participant">

            { participantName }
          </span>
        }
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
              <a href="#" onClick={currentVote == 1 ? onResetVote : onUpvote} className={`upvote ${currentVote == 1 ? "active" : ""}`}>
                <i className={`fas fa-chevron-circle-up fa-lg`}></i>
              </a>
              <span className="counter">{ votingScore }</span>
              <a href="#" onClick={currentVote == -1 ? onResetVote : onDownvote} className={`downvote ${currentVote == -1 ? "active" : ""}`}>
                <i className={`fas fa-chevron-circle-down fa-lg`}></i>
              </a>
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
}

export default Post
