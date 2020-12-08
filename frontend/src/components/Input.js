import React from 'react'
import styled from 'styled-components'

const Input = props => (
  <InputWrapper {...props}>
    <input
      type={props.type}
      name={props.name}
      required={props.required}
      value={props.value}
      onChange={props.handleChange}
      pattern={props.pattern}
      autoComplete={props.autoComplete}
    />
    <span className='bar' />
    <label>{props.placeholder}</label>
  </InputWrapper>
)

const InputWrapper = styled.div`
  position: relative;
  margin: 2rem 1em;

  input {
    background: none;
    color: ${props => props.theme.neutral900};
    font-size: 1.8rem;
    padding: 1rem 1rem 1rem .5rem;
    display: block;
    width: 100%;
    border: none;
    border-radius: 0;
    border-bottom: 1px solid ${props => props.theme.neutral100};
    &:focus {
      outline: none;
    }
    &:focus ~ label,
    &:valid ~ label {
      top: -1.4rem;
      font-size: 1.2rem;
      color: ${props => props.theme.primaryVivid500};
    }
    &:focus ~ .bar:before {
      width: 100%;
    }

    &:invalid+.bar:before {
      background: ${props => props.theme.negativeVivid500};
    }

    &:valid+.bar:before {
      background: ${props => props.theme.primaryVivid500};
    }
  }

  label {
    color: ${props => props.theme.neutral900};
    font-size: 1.6rem;
    font-weight: normal;
    position: absolute;
    pointer-events: none;
    left: .5rem;
    top: 1rem;
    transition: 300ms ease all;
  }

  .bar {
    position: relative;
    display: block;
    width: 100%;
    &:before {
      content: '';
      height: .2rem;
      width: 0;
      bottom: 0;
      position: absolute;
      background: ${props => props.theme.primaryVivid500};
      transition: 300ms ease all;
      left: 0;
    }
  }
`

export default Input
