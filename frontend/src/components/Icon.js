import React from 'react'
import styled from 'styled-components'

const Icon = props => {
  return (
    <IconWrapper {...props}>
      <i className='material-icons'>{props.name}</i>
    </IconWrapper>
  )
}

const IconWrapper = styled.div`
  display: ${props => props.hidden ? 'none' : 'block'};
  cursor: ${props => props.onClick ? 'pointer' : 'default'}

  i {
    font-size: ${props => props.size ? `${props.size}rem` : '3rem'};
  }
`

export default Icon
