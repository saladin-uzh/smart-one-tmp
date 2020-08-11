import React, { useState, useEffect } from 'react'

import { ThemeProvider as MuiThemeProvider } from '@material-ui/styles'
import { Grid, Button, TextField } from '@material-ui/core'

import { rememberMeAction } from '../store/login'

const LoginForm = ({
  // email,
  username,
  rememberMe,
  dispatch,
  onSubmit,
  onShowReset,
  error,
  clearCache,
}) => {
  // const [emailInput, setEmailInput] = useState(email)
  const [usernameInput, setUsernameInput] = useState(username)
  const [password, setPassword] = useState('')
  // const [rememberMeInput, setRememberMeInput] = useState(rememberMe)

  const onFormSubmit = (event) => {
    event.preventDefault()

    dispatch(rememberMeAction.set(rememberMe, true))

    onSubmit(username, password)
  }

  const changeUsername = (event) => setUsernameInput(event.target.value)

  const changePassword = (event) => setPassword(event.target.value)

  // const changeRememberMe = (event, checked) => setRememberMeInput(checked)

  useEffect(() => {
    return () => clearCache()
  }, [clearCache])

  const msg = typeof error === 'string' ? error : ''

  return (
    <MuiThemeProvider>
      <form onSubmit={onFormSubmit}>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <h1>SmartONE Grandview</h1>
            <TextField
              value={usernameInput}
              onChange={changeUsername}
              hintText="Username"
            />
            <TextField
              value={password}
              onChange={changePassword}
              hintText="Password"
              type="password"
              errorText={msg}
              autoComplete="new-password"
            />
            <div style={{ marginTop: '30px' }}>
              <Button variant="contained" primary type="submit">
                Log in
              </Button>
            </div>
            <div style={{ marginTop: '30px' }}>
              <a href="!#" onClick={onShowReset}>
                Forgot your password?
              </a>
            </div>
          </Grid>
        </Grid>
      </form>
    </MuiThemeProvider>
  )
}

export default LoginForm
