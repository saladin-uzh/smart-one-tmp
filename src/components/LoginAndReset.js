import React, { useState } from "react"
import { Login, PasswordReset } from "react-cognito"

import { PasswordResetForm, LoginForm } from "."
import { Grid } from "@material-ui/core"

export default ({ rememberMe, dispatch }) => {
  const [showReset, setShowReset] = useState(false)

  const onShowReset = () => setShowReset((showReset) => !showReset)

  return (
    <Grid
      container
      alignItems="center"
      justify="center"
      style={{ height: "100%" }}
    >
      {showReset ? (
        <PasswordReset>
          <PasswordResetForm />
        </PasswordReset>
      ) : (
        <Login>
          <LoginForm
            onShowReset={onShowReset}
            rememberMe={rememberMe}
            dispatch={dispatch}
          />
        </Login>
      )}
    </Grid>
  )
}
