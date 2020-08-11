import React, { useState, useEffect } from 'react'

import {
  ThemeProvider as MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'

import { rememberMeAction } from '../store/login'

import { colors } from '../constants'

import { ButtonUI, TextFieldUI, TitleUI, LinkUI } from '../ui'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.main,
    },
    text: {
      primary: colors.text,
    },
  },
})

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

  const hasError = Boolean(error)

  return (
    <MuiThemeProvider theme={theme}>
      <form onSubmit={onFormSubmit}>
        <Grid container direction="column" spacing={5}>
          <Grid item xs={12}>
            <TitleUI>SmartONE Grandview</TitleUI>
          </Grid>
          <Grid container item direction="column" spacing={4}>
            <Grid item xs={12}>
              <TextFieldUI
                value={usernameInput}
                onChange={changeUsername}
                label="User name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextFieldUI
                type="password"
                value={password}
                onChange={changePassword}
                label="Password"
                helperText={error}
                error={hasError}
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <ButtonUI>Log in</ButtonUI>
          </Grid>
          <Grid item xs={12}>
            <LinkUI onClick={onShowReset}>Forgot your password?</LinkUI>
          </Grid>
        </Grid>
      </form>
    </MuiThemeProvider>
  )
}

export default LoginForm
