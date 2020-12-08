import React from 'react'
import styled from 'styled-components'

import Icon from './Icon'
import CircleLoader from './CircleLoader'

const Header = ({ onMenuClick, onDeleteclick, title, loading }) => {
  return (
    <HeaderWrapper>
      <Icon class='menu' name='menu' onClick={onMenuClick} />
      <h1>{title}</h1>
      {
        onDeleteclick &&
          <Icon name='delete_sweep' onClick={onDeleteclick} />
      }
      {
        loading &&
          <CircleLoader white />
      }
    </HeaderWrapper>
  )
}

const HeaderWrapper = styled.header`
  position: fixed;
  z-index: 200;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1rem;
  width: 100%;
  height: ${props => props.theme.navHeight};
  top: 0;
  left: 0;
  background-color: ${props => props.theme.primary600};
  box-shadow: ${props => props.theme.dp2};
  color: ${props => props.theme.white};

  .hide {
    cursor: pointer;
  }

  i {
    font-size: 3rem;
  }

  h1 {
    font-size: 1.7rem;
    margin: 0 0 0 5rem;
    position: absolute;
    text-transform: capitalize;
  }
`

export default Header
