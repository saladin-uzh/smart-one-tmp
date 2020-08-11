import React from 'react'

import { withStyles, Button } from '@material-ui/core'

import { colors } from '../constants'

const StyledButton = withStyles({
  root: {
    color: colors.white,
    textTransform: 'none',
    fontWeight: 'bold',
    borderRadius: '8px',
  },
  label: {
    position: 'relative',
    top: '.125em',
  },
})(Button)

const ButtonUI = ({ children, ...props }) => (
  <StyledButton size="large" variant="contained" color="primary" {...props}>
    {children}
  </StyledButton>
)

export default ButtonUI
