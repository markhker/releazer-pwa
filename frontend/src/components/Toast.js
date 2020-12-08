import React, { useState, useContext } from 'react'
import styled from 'styled-components'

import { Store } from '../store'
import Icon from './Icon'
import Button from './Button'
import useToggleAction from '../hooks/useToggleAction'
import { TOAST } from '../config/actions'

const Toast = ({ title, content, okButton, okClick, onClose }) => {
  const [fadeType, setFadeType] = useState('in')
  const { state } = useContext(Store)
  const [ toast ] = useToggleAction(TOAST)
  const { toastTitle, msg, type, buttonText, left, onOk } = state.ui.toastContent

  const handleClick = e => {
    e.preventDefault()
    onOk && toast.open({ executeFunction: true })
    setFadeType('out')
  }

  const transitionEnd = e => {
    if (e.propertyName !== 'transform' || fadeType === 'in') return
    if (fadeType === 'out') onClose()
  }

  return (
    <ToastWrapper
      className={`fade-${fadeType}`}
      onTransitionEnd={transitionEnd}
      type={type}
    >
      {
        msg &&
          <>
            <Icon name={type === 'error' ? 'error' : type === 'success' ? 'done' : 'notification_important'} size={3} />
            <div className='text'>
              <h2 className='title'>{toastTitle}</h2>
              <p className='content'>
                {msg}
              </p>
            </div>
            <div className='buttons'>
              <Button
                primary
                small
                left={left}
                onClick={handleClick}
              >
                {buttonText || 'Ok'}
              </Button>
            </div>
          </>
      }
      {
        !msg &&
        <>
          <Icon name='notification_important' size={3} />
          <div className='text' id='lol'>
            <h2 className='title'>{title}</h2>
            <p className='content'>
              {content}
            </p>
          </div>
          <div className='buttons'>
            {
              (buttonText || okButton) &&
              <Button
                primary
                small
                left={left}
                onClick={okClick}
              >
                {buttonText || okButton}
              </Button>
            }
            <Icon onClick={handleClick} name='close' size={3} />
          </div>
        </>
      }
    </ToastWrapper>
  )
}

const ToastWrapper = styled.div`
  position: fixed;
  display: flex;
  justify-content: flex-start;
  padding: 1rem 2rem;
  width: 90%;
  max-width: 60rem;
  box-shadow: ${props => props.theme.dp5};
  background-color: ${props => props.theme.white};
  bottom: 2rem;
  transform: translateY(200%);
  right: 0;
  left: 0;
  margin: auto;
  align-items: center;
  transition: all ease 500ms;
  z-index: 90000;

  ::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: ${props =>
    props.type === 'error'
      ? props.theme.negativeVivid600
      : props.type === 'success'
        ? props.theme.positiveVivid500
        : props.theme.primaryVivid500};
  }

  &.fade-in {
    transform: translateY(0);
  }

  &.fade-out {
    transform: translateY(200%);
  }

  .text {
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
  }

  .title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 500;
  }

  .content {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 300;
  }

  .buttons {
    display: flex;
    align-items: center;
    margin-left: auto;
  }
`

export default Toast
