import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Grid from 'material-ui-next/Grid'
import {
  // EmailVerification,
  // Confirm,
  changePassword,
} from 'react-cognito'
import { rememberMeAction } from '../store/login'

export default class ChangePasswordForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      loginDisplay: 'none',
      formDisplay: 'block',
    }
  }

  onSubmit = (event) => {
    if (this.state.newPassword !== this.state.confirmPassword)
      this.setState({
        error: 'Your new password and confirmation password do not match.',
      })
    else {
      const user = this.props.user.user
      event.preventDefault()
      changePassword(user, this.state.oldPassword, this.state.newPassword).then(
        () => {
          this.setState({ loginDisplay: 'block', formDisplay: 'none' })
        },
        (error) => this.setState({ error })
      )
    }
  }

  onShowLogin = () => {
    this.props.dispatch(rememberMeAction.set(this.props.rememberMe))
  }

  changeOldPassword = (event) => {
    this.setState({ oldPassword: event.target.value })
  }

  changeNewPassword = (event) => {
    this.setState({ newPassword: event.target.value })
  }

  changeConfirmPassword = (event) => {
    this.setState({ confirmPassword: event.target.value })
  }

  render = () => {
    return (
      <MuiThemeProvider>
        <div style={{ display: this.state.formDisplay }}>
          <form onSubmit={this.onSubmit}>
            <Grid container spacing={16}>
              <Grid item xs={4} />
              <Grid item xs={8}>
                <h1>SmartONE Ten York</h1>
                <h2>Change Password</h2>
                <TextField
                  onChange={this.changeOldPassword}
                  hintText="Old Password"
                  type="password"
                />
                <br />
                <TextField
                  onChange={this.changeNewPassword}
                  hintText="New Password"
                  type="password"
                />
                <TextField
                  onChange={this.changeConfirmPassword}
                  hintText="Confirmation Password"
                  type="password"
                  errorText={this.state.error}
                />
                <div style={{ marginTop: '30px' }}>
                  <RaisedButton primary type="submit">
                    Change password
                  </RaisedButton>
                </div>
              </Grid>
            </Grid>
          </form>
        </div>
        <div style={{ marginTop: '30px', display: this.state.loginDisplay }}>
          Password changed successfully.{' '}
          <a href="!#" onClick={this.onShowLogin}>
            Login
          </a>{' '}
          with new password.
        </div>
      </MuiThemeProvider>
    )
  }
}
