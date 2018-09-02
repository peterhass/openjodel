import React, { Component } from 'react'
import Post from './Post'
import NewPost from './NewPost'
import Moment from 'moment'
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized'

class PostList extends Component {
  render() {
    
  }

  isRowLoaded({ index }) {
    return !!this.props.posts[index]
  }

  loadMoreRows({ startIndex, stopIndex }) {
    console.log("calling onLoadMore ...")
    return this.props.onLoadMore()
  }

  rowRenderer({ key, index, style }) {
    const post = this.props.posts[index]

    if (!post) return (<div>Loading ...</div>)

    const { onPostVoting } = this.props

    return (
      <div className="list-group-item green" key={key} style={style}>
        <Post
          {...post}
          onUpvote={() => onPostVoting(post.id, 1)}
          onDownvote={() => onPostVoting(post.id, -1)}
          onResetVote={() => onPostVoting(post.id, 0)}
        />
      </div>
    )
  }

  render() {

    return (

      <InfiniteLoader
        isRowLoaded={this.isRowLoaded.bind(this)}
        loadMoreRows={this.loadMoreRows.bind(this)}
        minimumBatchSize={1}
        rowCount={this.props.posts.length + 1}
      >
        
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer>
            {({ height, width }) => (

                  <List
                    height={console.log(height), height}
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    rowCount={this.props.posts.length}
                    rowHeight={160}
                    rowRenderer={this.rowRenderer.bind(this)}
                    width={width}
                  />
            )}
          </AutoSizer>

      )}
    </InfiniteLoader>


    )

  }
}

class Thread extends Component {
  componentDidMount() {
    this.props.subscribeToPostChanges()
  }


  render() {
    const { thread, posts, onPostVoting, onCreatePost, onLoadMore } = this.props

    const orderedPosts = [...posts].sort((leftPost, rightPost) =>
      Moment.utc(leftPost.insertedAt).diff(Moment.utc(rightPost.insertedAt))
    )

    return (
    <div>
      <div className="single-thread openjodel-list openjodel-10-screen">
        <div className="screen-body">
          <div className="list-group-item green thread-item">
            <div className="">
              <Post 
                key={thread.id} 
                {...thread} 
                onUpvote={() => onPostVoting(thread.id, 1)}
                onDownvote={() => onPostVoting(thread.id, -1)}
                onResetVote={() => onPostVoting(thread.id, 0)}

              />
            </div>
          </div>
          <PostList posts={posts} onPostVoting={onPostVoting} onLoadMore={onLoadMore} />
        </div>
      </div>
      <div className="openjodel-2-screen">
        <div className="screen-body">
          <NewPost 
            onCreatePost={onCreatePost}
          />
        </div>
      </div>
    </div>

    )
  }
}

export default Thread
