import React, { useState, useEffect } from "react"

import { Grid } from "@material-ui/core"

import { rememberMeAction } from "../store/login"

import { ButtonUI, TextFieldUI, TitleUI, LinkUI } from "../ui"

const LoginForm = ({
  // email,
  username,
  rememberMe,
  dispatch,
  onSubmit,
  onShowReset,
  clearCache,
}) => {
  // const [emailInput, setEmailInput] = useState(email)
  const [usernameInput, setUsernameInput] = useState(username)
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [helperText, setHelperText] = useState("")
  // const [rememberMeInput, setRememberMeInput] = useState(rememberMe)

  const onFormSubmit = (event) => {
    event.preventDefault()

    dispatch(rememberMeAction.set(rememberMe, true))

    onSubmit(usernameInput, password).catch(({ message }) => {
      setError(true)
      setHelperText(message)
    })
  }

  const changeUsername = (event) => setUsernameInput(event.target.value)

  const changePassword = (event) => setPassword(event.target.value)

  // const changeRememberMe = (event, checked) => setRememberMeInput(checked)

  useEffect(() => {
    return () => clearCache()
  }, [clearCache])

  return (
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
              helperText={helperText}
              error={error}
            />
          </Grid>
          <Grid item xs={12}>
            <TextFieldUI
              type="password"
              value={password}
              onChange={changePassword}
              label="Password"
              helperText={helperText}
              error={error}
              autoComplete="new-password"
              required
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <ButtonUI type="submit">Log in</ButtonUI>
        </Grid>
        <Grid item xs={12}>
          <LinkUI onClick={onShowReset}>Forgot your password?</LinkUI>
        </Grid>
      </Grid>
    </form>
  )
}

export default LoginForm
