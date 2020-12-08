import React from 'react'
import styled from 'styled-components'

import Button from './Button'

const ConfirmEmail = ({ login }) => {
  return (
    <Wrapper>
      <h1>Please confirm your email, then click on Login</h1>
      <Button
        primary
        onClick={login}
      >
        Login
      </Button>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: white;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-align: center;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  z-index: 999;
`

export default ConfirmEmail
