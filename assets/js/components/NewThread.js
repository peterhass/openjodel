import React, {Component} from 'react'

class NewThread extends Component {
  constructor(props) {
    super(props)

    this.state = { message: "" }
  }


  render() {
    const { onCreateThread } = this.props
    const { message } = this.state

    return (
      <div className="new-thread row">
        <div className="col-12">
          <div className="form-group">
            <textarea 
              className="form-control" 
              placeholder="What do you want to tell the world?"
              onChange={(e) => { this.setState({ message: e.target.value })  }}
              value={message}
            ></textarea>
          </div>
          <div className="form-group">
            <button 
              className="form-control btn btn-primary" 
              onClick={() => onCreateThread({ message })}>Weiter</button>
          </div>
          
        </div>
      </div>
    )
  }
}

export default NewThread
