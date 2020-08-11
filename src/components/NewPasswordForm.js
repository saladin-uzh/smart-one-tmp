import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Grid from 'material-ui-next/Grid'

export default class NewPasswordForm extends React.Component {
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
                <RaisedButton primary type="submit">
                  Submit
                </RaisedButton>
              </div>
            </Grid>
          </Grid>
        </form>
      </MuiThemeProvider>
    )
  }
}
