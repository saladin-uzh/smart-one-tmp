import React, { Component } from 'react'

import { ThemeProvider as MuiThemeProvider } from '@material-ui/styles'
import { Grid, Button, TextField } from '@material-ui/core'

export default class NewPasswordForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: props.error,
      password: '',
    }
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.props.onSubmit(this.state.password)
  }

  changePassword = (event) => {
    this.setState({ password: event.target.value })
  }

  render = () => {
    const msg = typeof this.props.error === 'string' ? this.props.error : ''
    return (
      <MuiThemeProvider>
        <form onSubmit={this.onSubmit}>
          <Grid container spacing={16}>
            <Grid item xs={4} />
            <Grid item xs={8}>
              <h1>SmartONE Ten York</h1>
              <h2>Please select a new password for your account:</h2>
              <TextField
                onChange={this.changePassword}
                hintText="Password"
                required
                type="password"
                errorText={msg}
              />
              <div style={{ marginTop: '30px' }}>
                <Button variant="contained" primary type="submit">
                  Submit
                </Button>
              </div>
            </Grid>
          </Grid>
        </form>
      </MuiThemeProvider>
    )
  }
}
