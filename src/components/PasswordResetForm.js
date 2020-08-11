import React, { useState } from 'react'

import {
  ThemeProvider as MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'

import { colors } from '../constants'

import { TitleUI, ButtonUI, TextFieldUI } from '../ui'

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

const PasswordResetForm = ({ username, setPassword, sendVerificationCode }) => {
  const [usernameInput, setUsernameInput] = useState(username)
  const [code, setCode] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isPwdReset, setIsPwdReset] = useState(false)

  const onSubmit = (event) => {
    event.preventDefault()

    setPassword(usernameInput, code, passwordInput)
      .then(() => {
        setMessage('Password reset')
        setError('')
        setIsPwdReset(true)
      })
      .catch(({ message: errMsg }) => {
        setMessage('')
        setError(errMsg)
      })
  }

  const handleVerificationCodeSend = (event) => {
    event.preventDefault()

    sendVerificationCode(usernameInput)
      .then(() => {
        setMessage('Verification code sent')
        setError('')
        setIsCodeSent(true)
      })
      .catch(({ code, message: errMsg }) => {
        if (code === 'UserNotFoundException') setError('User not found')
        else setError(errMsg)
      })
  }

  const changePassword = (event) => setPasswordInput(event.target.value)

  const changeCode = (event) => setCode(event.target.value)

  const changeUsername = (event) => setUsernameInput(event.target.value)

  const msg = typeof error === 'string' ? error : ''
  let verify = null

  if (isCodeSent && !isPwdReset) {
    verify = (
      <div>
        <h4>{message}</h4>
        <h4>
          Please provide your verification code to select a new password for
          your account:
        </h4>
        <TextFieldUI
          onChange={changeCode}
          hintText="Verification Code"
          required
        />
        <TextFieldUI
          onChange={changePassword}
          hintText="New Password"
          required
          type="password"
          errorText={msg}
        />
        <div style={{ marginTop: '30px' }}>
          <ButtonUI>Submit</ButtonUI>
        </div>
      </div>
    )
  }

  if (isCodeSent && isPwdReset) {
    verify = (
      <div>
        <h4>Your password has been reset.</h4>
        <a href="/">Login</a>
      </div>
    )
  }

  if (!isCodeSent) {
    verify = (
      <div>
        <h4 style={{ color: colors.secondary }}>
          Please provide your username; we&apos;ll email a verification code to
          you
        </h4>
        <TextFieldUI
          onChange={changeUsername}
          hintText="Username"
          required
          errorText={msg}
        />
        <div style={{ marginTop: '30px' }}>
          <ButtonUI onClick={handleVerificationCodeSend}>Send code</ButtonUI>
        </div>
      </div>
    )
  }

  return (
    <MuiThemeProvider theme={theme}>
      <form onSubmit={onSubmit}>
        <Grid container direction="column" spacing={5}>
          <Grid item xs={12}>
            <TitleUI>SmartONE Grandview</TitleUI>
          </Grid>
          <Grid item xs={12}>
            {verify}
          </Grid>
        </Grid>
      </form>
    </MuiThemeProvider>
  )
}

export default PasswordResetForm
