import React, { useState } from "react"
import { changePassword } from "react-cognito"

import { ThemeProvider as MuiThemeProvider } from "@material-ui/styles"

import { Button, TextField, Grid } from "@material-ui/core"

import { rememberMeAction } from "../store/login"

export default ({ user, dispatch, rememberMe }) => {
  const [error, setError] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loginDisplay, setLoginDisplay] = useState("name")
  const [formDisplay, setFormDisplay] = useState("block")

  const onSubmit = (event) => {
    event.preventDefault()

    if (newPassword !== confirmPassword)
      setError("Your new password and confirmation password do not match.")
    else {
      const targetUser = user.user

      changePassword(targetUser, oldPassword, newPassword).then(
        () => {
          setLoginDisplay("block")
          setFormDisplay("none")
        },
        (err) => setError(err)
      )
    }
  }

  const onShowLogin = () => dispatch(rememberMeAction.set(rememberMe))

  const changeOldPassword = (event) => setOldPassword(event.target.value)

  const changeNewPassword = (event) => setNewPassword(event.target.value)

  const changeConfirmPassword = (event) =>
    setConfirmPassword(event.target.value)

  return (
    <MuiThemeProvider>
      <div style={{ display: formDisplay }}>
        <form onSubmit={onSubmit}>
          <Grid container spacing={16}>
            <Grid item xs={4} />
            <Grid item xs={8}>
              <h1>SmartONE Ten York</h1>
              <h2>Change Password</h2>
              <TextField
                onChange={changeOldPassword}
                hintText="Old Password"
                type="password"
              />
              <br />
              <TextField
                onChange={changeNewPassword}
                hintText="New Password"
                type="password"
              />
              <TextField
                onChange={changeConfirmPassword}
                hintText="Confirmation Password"
                type="password"
                errorText={error}
              />
              <div style={{ marginTop: "30px" }}>
                <Button variant="contained" primary type="submit">
                  Change password
                </Button>
              </div>
            </Grid>
          </Grid>
        </form>
      </div>
      <div style={{ marginTop: "30px", display: loginDisplay }}>
        Password changed successfully.{" "}
        <a href="!#" onClick={onShowLogin}>
          Login
        </a>{" "}
        with new password.
      </div>
    </MuiThemeProvider>
  )
}
