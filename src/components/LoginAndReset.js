import React, { useState } from 'react'
import { Login, PasswordReset } from 'react-cognito'

import { PasswordResetForm, LoginForm } from '.'

const LoginAndReset = ({ rememberMe, dispatch }) => {
  const [showReset, setShowReset] = useState(false)

  const onShowReset = () => setShowReset((showReset) => !showReset)

  return showReset ? (
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
  )
}

export default LoginAndReset
