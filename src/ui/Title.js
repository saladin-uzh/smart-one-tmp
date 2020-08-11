import React from 'react'

import { colors, spacings } from '../constants'

import logo from '../assets/ONElogo_ns.png'

const TitleUI = ({ children, ...props }) => (
  <h1
    style={{
      color: colors.text,
      fontWeight: 'bold',
      maxHeight: spacings.xxLarge,
      pointerEvents: 'none',
    }}
    {...props}
  >
    <img
      src={logo}
      alt="Welcome to "
      style={{
        display: 'inline-block',
        maxHeight: spacings.xxLarge,
        transform: `translate(-${spacings.medium}, ${spacings.small})`,
      }}
    />
    {children}
  </h1>
)

export default TitleUI
