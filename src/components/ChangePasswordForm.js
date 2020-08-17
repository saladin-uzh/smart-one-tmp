import React, { useState } from "react"
import { changePassword } from "react-cognito"
  
import { Button, Grid, Paper } from "@material-ui/core"

import { rememberMeAction } from "../store/login"
import { LinkUI, TitleUI, TextFieldUI } from "../ui"
import { spacings } from "../constants"

export default ({ user, dispatch, rememberMe }) => {
  const [error, setError] = useState(false)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loginDisplay, setLoginDisplay] = useState("none")

  const onSubmit = (event) => {
    event.preventDefault()

    if (newPassword !== confirmPassword)
      setError("Your new password and confirmation password do not match.")
    else {
      const targetUser = user.user

      changePassword(targetUser, oldPassword, newPassword).then(
        () => {
          setLoginDisplay("block")
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
    <Grid container justify="center" alignItems="center">
      <Paper style={{ padding: spacings.large, width: "auto" }}>
        <form onSubmit={onSubmit} style={{ maxWidth: 420 }}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TitleUI>Change Password</TitleUI>
            </Grid>
            <Grid container item spacing={4}>
              <Grid item xs={12}>
                <TextFieldUI
                  value={oldPassword}
                  onChange={changeOldPassword}
                  label="Old Password"
                  error={Boolean(error)}
                  type="password"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextFieldUI
                  type="password"
                  value={newPassword}
                  onChange={changeNewPassword}
                  label="New Password"
                  error={Boolean(error)}
                  autoComplete="new-password"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextFieldUI
                  type="password"
                  value={newPassword}
                  onChange={changeConfirmPassword}
                  label="Confirmation Password"
                  error={Boolean(error)}
                  autoComplete="new-password"
                  required
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit">Change password</Button>
            </Grid>
          </Grid>
        </form>

        <Grid item xs={12} style={{ marginTop: "30px", display: loginDisplay }}>
          Password changed successfully.
          <LinkUI style={{ padding: 0 }} href="!#" onClick={onShowLogin}>
            Login
          </LinkUI>
          with new password.
        </Grid>
      </Paper>
    </Grid>
  )
}
