import React from 'react'

import { withStyles, TextField } from '@material-ui/core'

import { colors, spacings } from '../constants'

const StyledTextField = withStyles({
  root: {
    '& .MuiInputLabel-outlined': {
      transform: `translate(${spacings.small}, -${spacings.large}) scale(.9)`,
      fontWeight: 'bold',
      '&.MuiInputLabel-shrink': {
        transform: `translate(${spacings.large}, -${spacings.small}) scale(.725)`,
      },
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      '& fieldset': {
        borderColor: colors.main,
      },
      '&:hover fieldset': {
        borderColor: colors.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: colors.main,
      },
    },
  },
})(TextField)

const TextFieldUI = (props) => (
  <StyledTextField variant="outlined" size="small" color="primary" {...props} />
)

export default TextFieldUI
