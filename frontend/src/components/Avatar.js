import React from 'react'
import styled from 'styled-components'

import { getHex } from '../helpers/randomColor'

const Avatar = ({ noUser, alt }) => {
  const initial = alt.charAt()

  return (
    <AvatarContainer>
      {
        noUser &&
        <DefaultAvatar>{initial}</DefaultAvatar>
      }
    </AvatarContainer>
  )
}

const AvatarContainer = styled.div`
  height: 10rem;
  width: 10rem;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.white};
`

const DefaultAvatar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 5rem;
  font-weight: 400;
  border-radius: 50%;
  background-color: ${getHex()};
  text-transform: uppercase;
`

export default Avatar
