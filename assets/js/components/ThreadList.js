import React, {Component} from 'react'
import Post from './Post'
import Moment from 'moment'

class ThreadList extends Component {
  componentDidMount() {
    this.props.subscribeToThreadsChanges()
  }

  render() {
    const { threads, onPostVoting, CommentLink, NewThreadLink } = this.props

    const orderedThreads = [...threads].sort((leftThread, rightThread) => 
      Moment.utc(rightThread.insertedAt).diff(Moment.utc(leftThread.insertedAt))
    )

    return (
      <div className="thread-list openjodel-list row">
        <div className="col-12 screen-heading">
          <h1>Threads</h1>
        </div>
        <div className="col-12 list-group list-unstyled">
          {orderedThreads.map(thread =>
            <div className="list-group-item green" key={thread.id}>
              <div className="row">  
                <Post
                  {...thread}
                  onUpvote={() => onPostVoting(thread.id, 1)}
                  onDownvote={() => onPostVoting(thread.id, -1)}
                  onResetVote={() => onPostVoting(thread.id, 0)}
                  CommentLink={CommentLink}
                />
              </div>
            </div>
          )}
        </div>
        <div className="floating-action-button">
          <NewThreadLink>
            <i className="fas fa-plus-square fa-5x"></i>
          </NewThreadLink>
        </div>
      </div>
    )
  }
}

export default ThreadList
