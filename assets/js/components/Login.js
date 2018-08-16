import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { getAuthToken, setAuthToken } from '../apollo_client'

const SIGNUP_MUTATION = gql`
  mutation SignupMutation {
    signup {
      token
    }
  }
`

const RESTORE_MUTATION = gql`
  mutation Login($token: String!) {
    login(token: $token) {
      token
    }
  }
`
class Login extends Component {
  state = {
    restoreKey: ''
  }

  render() {
    const { restoreKey } = this.state
    const authToken = getAuthToken()

    return (
      <div>
        <Mutation
          mutation={SIGNUP_MUTATION}
          onCompleted={data => this._confirm(data)}
        >
          {mutation => (

            <button 
              className="btn btn-primary"
              onClick={mutation}>Start</button>
          )}
        </Mutation>
        <div className="card border-dark mb-3">
          <div className="card-body">
            <h5 className="card-title">Restore</h5>
            <Mutation
              mutation={RESTORE_MUTATION}
              variables={{ token: restoreKey }}
              onCompleted={data => this._confirm(data)}>
              {mutation => (
                <div>
                  <input 
                    type="text" 
                    placeholder="Restore Key" 
                    value={restoreKey} 
                    onChange={e => this.setState({ restoreKey: e.target.value })}
                  />
                  <button 
                    className="btn btn-primary"
                    onClick={mutation}>Restore</button>
                </div>
              )}
            </Mutation>
          </div>
        </div>
      </div>
    )
  }

  _confirm(data) {
    let token = data.login ? data.login.token : data.signup.token

    setAuthToken(token)
    this.props.history.push('/')
  }
  
}

export default Login