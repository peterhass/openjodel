import React, {Component} from 'react'

class NewPost extends Component {
  constructor(props) {
    super(props)

    this.state = { message: '' }
  }

  render() {
    const { message } = this.state
    const { onCreatePost } = this.props

    return (
      <div className="row">
        <div className="col-12">
          <div className="form-group">
            <textarea
              className="form-control"
              placeholder="What do you want to tell the world?"
              onChange={(e) => { this.setState({ message: e.target.value }) }}
              value={message}
            ></textarea>
          </div>
          <div className="form-group">
            <button
              className="form-control btn btn-primary"
              onClick={() => onCreatePost({ message })}
            >Create</button>
          </div>
        </div>
      </div>
    )
  }
}

export default NewPost
