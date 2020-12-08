import React from 'react'
import styled from 'styled-components'

const Button = props => {
  return (
    <ButtonWrapper
      {...props}
      onClick={props.onClick}
    >
      {props.children}
    </ButtonWrapper>
  )
}

const ButtonWrapper = styled.button`
  position: ${props =>
    props.floating
      ? 'fixed'
      : props.left
        ? 'absolute'
        : null};
  background-color: ${props =>
    props.disabled
      ? props.theme.neutral400
      : props.primary
        ? props.theme.primaryVivid600
        : props.success
          ? props.theme.positiveVivid500
          : props.danger
            ? props.theme.negativeVivid500
            : props.flat
              ? 'transparent'
              : props.bgcolor
                ? props.bgcolor
                : props.theme.accentVivid600};
  color: ${props =>
    props.primary || props.success || props.danger
      ? props.theme.white
      : props.flat && props.whiteText
        ? props.theme.white
        : props.flat
          ? props.theme.neutral900
          : props.theme.white};
  border-radius: ${props =>
    props.floating
      ? '50%'
      : '.5rem'};
  padding: ${props =>
    props.small
      ? '1rem 1.5rem'
      : props.floating
        ? '1.5rem'
        : '1rem 3rem'};
  margin: ${props =>
    props.left
      ? '0'
      : '1rem'};
  right: ${props =>
    props.left
      ? '1rem'
      : null};
  font-size: ${props =>
    props.small
      ? '1.2rem'
      : props.floating
        ? 0
        : '2rem'};
  font-weight: 500;
  border: none;
  text-decoration: none;
  outline: none !important;
  transition: 0.3s ease-out;
  box-shadow: ${props =>
    props.flat
      ? 'none'
      : props.floating
        ? props.theme.dp2
        : props.theme.dp1};
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
  z-index: 800;
  bottom: ${props =>
    props.floating
      ? '1rem'
      : null};
  right: ${props =>
    props.floating
      ? '1rem'
      : null};

  :hover {
    box-shadow: ${props => props.theme.dp5};
  }
`

export default Button
