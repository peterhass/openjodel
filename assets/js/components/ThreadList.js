import React, {Component} from 'react'
import Post from './Post'
import Moment from 'moment'
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized'

class ThreadList extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.subscribeToThreadsChanges()
  }

  render() {
    const { NewThreadLink } = this.props


    return (
      <div className="thread-list openjodel-list openjodel-12-screen">
        <div className="screen-body">



      <AutoSizer>
        {({ height, width }) => (

          <InfiniteLoader
            isRowLoaded={this.isRowLoaded.bind(this)}
            loadMoreRows={this.loadMoreRows.bind(this)}
            minimumBatchSize={1}
            rowCount={this.props.threads.length + 1}
          >
            {({ onRowsRendered, registerChild }) => (
              <List
                height={height}
                onRowsRendered={onRowsRendered}
                ref={registerChild}
                rowCount={this.props.threads.length}
                rowHeight={160}
                rowRenderer={this.rowRenderer.bind(this)}
                width={width}
              />
            )}
          </InfiniteLoader>
        )}
      </AutoSizer>


        </div>
        <div className="floating-action-button">
          <NewThreadLink>
            <i className="fas fa-plus-square fa-5x"></i>
          </NewThreadLink>
        </div>
      </div>



    )
  }

  isRowLoaded({ index }) {
    return !!this.props.threads[index]
  }

  loadMoreRows({ startIndex, stopIndex }) {
    console.log('loadMoreRows', { startIndex, stopIndex })

    return this.props.onLoadMore()
  }

  rowRenderer({ key, index, style }) {
    const thread = this.props.threads[index]

    if (!thread) return (<div>Loading ...</div>)

    const { onPostVoting, CommentLink } = this.props

    return (
      <div className="list-group-item green" key={key} style={style}>
        <Post
          {...thread}
          children={thread.children.posts || []}
          onUpvote={() => onPostVoting(thread.id, 1)}
          onDownvote={() => onPostVoting(thread.id, -1)}
          onResetVote={() => onPostVoting(thread.id, 0)}
          CommentLink={CommentLink}
        />
      </div>
    )
  }

    

  ___renderRow(thread) {
    const { onPostVoting, CommentLink } = this.props


    return (
      <div className="list-group-item green" key={thread.id}>
        <div className="row">  
          <Post
            {...thread}
            children={thread.children.posts || []}
            onUpvote={() => onPostVoting(thread.id, 1)}
            onDownvote={() => onPostVoting(thread.id, -1)}
            onResetVote={() => onPostVoting(thread.id, 0)}
            CommentLink={CommentLink}
          />
        </div>
      </div>
    )
  }

  __render() {
    const { threads, onLoadMore, NewThreadLink } = this.props

    return (
      <div className="thread-list openjodel-list row">
        <div className="col-12 screen-heading">
          <h1>Threads</h1>
        </div>
        <div className="col-12 list-group list-unstyled">
          {threads.map(this._renderRow.bind(this))}
        </div>
        <button
          className="btn btn-primary" 
          onClick={() => onLoadMore()}>Load</button>
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
