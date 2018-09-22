import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { Text, View, Button, TextInput, StyleSheet } from 'react-native'
import Login from './Login'
import { setAuthToken } from '../apollo_client'


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

export default class LoginContainer extends React.Component {
  constructor() {
    super()
    this._confirm = this._confirm.bind(this)
  }

  render() {
    return (
      <Mutation 
        mutation={SIGNUP_MUTATION}
        onCompleted={data => this._confirm(data)}
      >
        {signupMutation => (
          <Mutation
            mutation={RESTORE_MUTATION}
            onCompleted={data => this._confirm(data)}
          >
            {restoreMutation => (
              <Login 
                onRestore={restoreMutation} 
                onSignup={signupMutation}
              />
            )}
          </Mutation>
        )}
      </Mutation>
    )
  }

  _confirm(data) {
    let token = data.login ? data.login.token : data.signup.token

    setAuthToken(token).then(() => this.props.history.push('/'))
  }
  
}
