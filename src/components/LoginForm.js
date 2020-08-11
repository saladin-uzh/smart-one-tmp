import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Grid from 'material-ui-next/Grid'
import { rememberMeAction } from '../store/login'

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: props.email,
      username: props.username,
      password: '',
      rememberMe: props.rememberMe,
    }
  }

  onSubmit = (event) => {
    event.preventDefault()

    this.props.dispatch(rememberMeAction.set(this.state.rememberMe, true))

    this.props.onSubmit(this.state.username, this.state.password)
  }

  changeUsername = (event) => {
    this.setState({ username: event.target.value })
  }

  changePassword = (event) => {
    this.setState({ password: event.target.value })
  }

  changeRememberMe = (event, checked) => {
    this.setState({ rememberMe: checked })
  }

  componentWillUnmount = () => {
    this.props.clearCache()
  }

  render = () => {
    const msg = typeof this.props.error === 'string' ? this.props.error : ''
    return (
      <MuiThemeProvider>
        <form onSubmit={this.onSubmit}>
          <Grid container spacing={16}>
            <Grid item xs={4} />
            <Grid item xs={8}>
              <h1>SmartONE Grandview</h1>
              <h2>Please log in</h2>
              <TextField onChange={this.changeUsername} hintText="Username" />
              <TextField
                onChange={this.changePassword}
                hintText="Password"
                type="password"
                errorText={msg}
                autoComplete="new-password"
              />
              <div style={{ marginTop: '30px' }}>
                <RaisedButton primary type="submit">
                  Log in
                </RaisedButton>
              </div>
              <div style={{ marginTop: '30px' }}>
                <a href="!#" onClick={this.props.onShowReset}>
                  Forgot your password?
                </a>
              </div>
            </Grid>
          </Grid>
        </form>
      </MuiThemeProvider>
    )
  }
}
