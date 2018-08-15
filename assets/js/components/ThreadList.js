import React, {Component} from 'react'
import Post from './Post'

class ThreadList extends Component {
  componentDidMount() {
    this.props.subscribeToThreadsChanges()
  }

  render() {
    const { threads, onPostVoting, CommentLink } = this.props

    return (
      <div className="thread-list openjodel-list row">
        <div className="col-12 screen-heading">
          <h1>Threads</h1>
        </div>
        <div className="col-12 list-group list-unstyled">
          {threads.map(thread =>
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
      </div>
    )
  }
}

export default ThreadList
