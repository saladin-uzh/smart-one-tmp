import React, { useState } from "react"

import { ThemeProvider as MuiThemeProvider } from "@material-ui/styles"
import { Grid, Button, TextField } from "@material-ui/core"

export default ({ error, onSubmit }) => {
  const [password, setPassword] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault()

    onSubmit(password)
  }

  const changePassword = (event) => setPassword(event.target.value)

  const msg = typeof error === "string" ? error : ""

  return (
    <MuiThemeProvider>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={16}>
          <Grid item xs={4} />
          <Grid item xs={8}>
            <h1>SmartONE Ten York</h1>
            <h2>Please select a new password for your account:</h2>
            <TextField
              onChange={changePassword}
              hintText="Password"
              required
              type="password"
              errorText={msg}
            />
            <div style={{ marginTop: "30px" }}>
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
