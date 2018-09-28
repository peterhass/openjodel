import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { Text, View, Button, TextInput, StyleSheet } from 'react-native'
import Login from './Login'
import { auth } from '../apollo_client'
import { Redirect } from 'react-router-native'


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

    this.state = {}
  }

  render() {
    const { redirectToReferrer } = this.state

    if (redirectToReferrer === true)
      return <Redirect to="/" />

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

    auth.setTokenAsync(token).then(() => {
      this.setState({ redirectToReferrer: true })
    })
  }
  
}
