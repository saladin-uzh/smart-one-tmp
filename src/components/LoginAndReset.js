import React from 'react'
import { Login, PasswordReset } from 'react-cognito'

import { PasswordResetForm, LoginForm } from '.'

export default class LoginAndReset extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showReset: false,
    }
  }

  onShowReset = () => {
    this.setState({ showReset: !this.state.showReset })
  }

  render() {
    const component = this
    const showComponent = component.state.showReset ? (
      <PasswordReset>
        <PasswordResetForm />
      </PasswordReset>
    ) : (
      <Login>
        <LoginForm
          onShowReset={this.onShowReset}
          rememberMe={this.props.rememberMe}
          dispatch={this.props.dispatch}
        />
      </Login>
    )
    return <div>{showComponent}</div>
  }
}
