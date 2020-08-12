import React, { useState, Fragment } from "react"

import { Grid } from "@material-ui/core"

import { colors, spacings } from "../constants"

import { TitleUI, ButtonUI, TextFieldUI } from "../ui"

const PasswordResetForm = ({ username, setPassword, sendVerificationCode }) => {
  const [usernameInput, setUsernameInput] = useState(username)
  const [code, setCode] = useState("")
  const [passwordInput, setPasswordInput] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isPwdReset, setIsPwdReset] = useState(false)

  const onSubmit = (event) => {
    event.preventDefault()

    setPassword(usernameInput, code, passwordInput)
      .then(() => {
        setMessage("Password reset")
        setError("")
        setIsPwdReset(true)
      })
      .catch(({ message: errMsg }) => {
        setMessage("")
        setError(errMsg)
      })
  }

  const handleVerificationCodeSend = (event) => {
    event.preventDefault()

    sendVerificationCode(usernameInput)
      .then(() => {
        setMessage("Verification code sent")
        setError("")
        setIsCodeSent(true)
      })
      .catch(({ code, message: errMsg }) => {
        if (code === "UserNotFoundException") setError("User not found")
        else setError(errMsg)
      })
  }

  const changePassword = (event) => setPasswordInput(event.target.value)

  const changeCode = (event) => setCode(event.target.value)

  const changeUsername = (event) => setUsernameInput(event.target.value)

  const hasError = Boolean(error)

  return (
    <form onSubmit={onSubmit}>
      <Grid container direction="column" spacing={5}>
        <Grid item xs={12}>
          <TitleUI>SmartONE Grandview</TitleUI>
        </Grid>
        <Grid item container direction="column" spacing={3}>
          {isCodeSent ? (
            isPwdReset ? (
              <div>
                <h4>Your password has been reset.</h4>
                <a href="/">Login</a>
              </div>
            ) : (
              <Fragment>
                <Grid item xs={12}>
                  <h4>{hasError ? error : message}</h4>
                </Grid>
                <Grid item xs={12}>
                  <h4>
                    Please provide your verification code to select a new
                    password for your account:
                  </h4>
                </Grid>
                <Grid container item direction="column" spacing={4}>
                  <Grid item container direction="column" spacing={3}>
                    <Grid item xs={12}>
                      <TextFieldUI
                        onChange={changeCode}
                        label="Verification Code"
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextFieldUI
                        type="password"
                        label="Password"
                        onChange={changePassword}
                        required
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} style={{ paddingTop: spacings.xLarge }}>
                    <ButtonUI onClick={handleVerificationCodeSend}>
                      Submit
                    </ButtonUI>
                  </Grid>
                </Grid>
              </Fragment>
            )
          ) : (
            <Grid item container direction="column" spacing={3}>
              <Grid item xs={12}>
                <h4 style={{ color: colors.secondary }}>
                  Please provide your username; we&apos;ll email a verification
                  code to you
                </h4>
              </Grid>
              <Grid item xs={12}>
                <TextFieldUI
                  onChange={changeUsername}
                  label="User name"
                  required
                />
              </Grid>
              <Grid item xs={12} style={{ paddingTop: spacings.xLarge }}>
                <ButtonUI onClick={handleVerificationCodeSend}>
                  Send code
                </ButtonUI>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </form>
  )
}

export default PasswordResetForm
