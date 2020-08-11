import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Grid from 'material-ui-next/Grid'

export default class PasswordResetForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: props.username,
      code: '',
      password: '',
      message: '',
      error: '',
      codeSent: false,
      pwdReset: false,
    }
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.props
      .setPassword(this.state.username, this.state.code, this.state.password)
      .then(() =>
        this.setState({
          message: 'Password reset',
          error: '',
          pwdReset: true,
        })
      )
      .catch((err) =>
        this.setState({
          message: '',
          error: err.message,
        })
      )
  }

  sendVerificationCode = (event) => {
    event.preventDefault()
    this.props
      .sendVerificationCode(this.state.username)
      .then(() =>
        this.setState({
          message: 'Verification code sent',
          error: '',
          codeSent: true,
        })
      )
      .catch((err) => {
        if (err.code === 'UserNotFoundException') {
          this.setState({ error: 'User not found' })
        } else {
          this.setState({ error: err.message })
        }
      })
  }

  changePassword = (event) => {
    this.setState({ password: event.target.value })
  }

  changeCode = (event) => {
    this.setState({ code: event.target.value })
  }

  changeUsername = (event) => {
    this.setState({ username: event.target.value })
  }

  render = () => {
    const msg = typeof this.props.error === 'string' ? this.props.error : ''
    let verify = null
    if (this.state.codeSent && !this.state.pwdReset) {
      verify = (
        <div>
          <h4>{this.state.message}</h4>
          <h4>
            Please provide your verification code to select a new password for
            your account:
          </h4>
          <TextField
            onChange={this.changeCode}
            hintText="Verification Code"
            required
          />
          <TextField
            onChange={this.changePassword}
            hintText="New Password"
            required
            type="password"
            errorText={msg}
          />
          <div style={{ marginTop: '30px' }}>
            <RaisedButton primary type="submit">
              Submit
            </RaisedButton>
          </div>
        </div>
      )
    }

    if (this.state.codeSent && this.state.pwdReset) {
      verify = (
        <div>
          <h4>Your password has been reset.</h4>
          <a href="/">Login</a>
        </div>
      )
    }

    if (!this.state.codeSent) {
      verify = (
        <div>
          <h4>
            Please provide your username; we&apos;ll email a verification code
            to you
          </h4>
          <TextField
            onChange={this.changeUsername}
            hintText="Username"
            required
            errorText={msg}
          />
          <div style={{ marginTop: '30px' }}>
            <RaisedButton onClick={this.sendVerificationCode} primary>
              Send code
            </RaisedButton>
          </div>
        </div>
      )
    }
    return (
      <MuiThemeProvider>
        <form onSubmit={this.onSubmit}>
          <Grid container spacing={16}>
            <Grid item xs={4} />
            <Grid item xs={8}>
              {verify}
            </Grid>
          </Grid>
        </form>
      </MuiThemeProvider>
    )
  }
}
