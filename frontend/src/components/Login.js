import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Auth, API } from 'aws-amplify'
import { Link } from '@reach/router'

import Input from './Input'
import Button from './Button'
import Loader from './Loader'
import ConfirmEmail from './ConfirmEmail'
import FacebookButton from './FacebookButton'
import useAsyncAction from '../hooks/useAsyncAction'
import useToggleAction from '../hooks/useToggleAction'
import { LOGIN_USER, TOAST } from '../config/actions'
import { Store } from '../store'

const Login = ({ navigate }) => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ isUserConfirmed, setIsUserConfirmed ] = useState(true)
  const { state } = useContext(Store)
  const { executeFunction } = state.ui.toastContent
  const [ loginAction ] = useAsyncAction(LOGIN_USER)
  const [ toast ] = useToggleAction(TOAST)

  useEffect(() => {
    executeFunction && sendSignup()
  }, [executeFunction])

  const validateForm = () => {
    return email.length > 0 && password.length > 0
  }

  const handleEmail = e => {
    setEmail(e.target.value)
  }

  const handlePassword = e => {
    setPassword(e.target.value)
  }

  const sendLogin = async () => {
    toast.close()
    loginAction()
    try {
      await Auth.signIn(email, password)
      const verifyUser = await API.post('createuser', '/createuser', {
        body: { email }
      })
      if (verifyUser.ok) {
        loginAction.success(verifyUser.data)
        navigate('../releases')
      } else {
        loginAction.fail(verifyUser)
      }
    } catch (e) {
      if (e.message === 'User does not exist.') {
        toast.open({ title: 'Create user?', msg: 'That user does not exist. Do you want to sign up?', onOk: true })
      } else if (e.message === 'User is not confirmed.') {
        setIsUserConfirmed(false)
      } else if (e.message === 'Incorrect username or password.') {
        toast.open({ title: 'Wrong', msg: 'Incorrect email or password, please try again', type: 'error' })
      }
      loginAction.fail(e.message)
    }
  }

  const sendSignup = async () => {
    toast.close()
    loginAction()
    try {
      const login = await Auth.signUp({
        username: email,
        password
      })
      loginAction.fail(login)
      setIsUserConfirmed(false)
    } catch (e) {
      loginAction.fail(e.message)
      if (e.message === 'An account with the given email already exists.') {
        sendLogin()
      }
    }
  }

  const setLogin = () => {
    loginAction.success({})
  }

  return (
    <Layout>
      {!isUserConfirmed && <ConfirmEmail login={sendLogin} />}
      {state.ui.isLoginLoading && <Loader />}
      <Link to='/'><Logo /></Link>
      <Title>Login</Title>
      <Input
        type='text'
        name='email'
        value={email}
        handleChange={handleEmail}
        placeholder='Your email'
        required
      />
      <Input
        type='password'
        name='password'
        value={password}
        handleChange={handlePassword}
        placeholder='Your password'
        required
      />
      <Button
        disabled={!validateForm()}
        primary
        onClick={sendLogin}
      >
        Login
      </Button>
      <Or />
      <FacebookButton setlogin={setLogin} />
    </Layout>
  )
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 3.5rem;
  height: 90vh;
  justify-content: center;
  max-width: 60rem;
  margin: 0 auto;

  h1 {
    font-size: 3.5rem;
    font-weight: 500;
  }
`

const Logo = styled.div`
  height: 8rem;
  width: 8rem;
  border: 1.5rem solid ${props => props.theme.neutral900};
  border-radius: 50%;
`

const Title = styled.h1`
  display: flex;
  margin-bottom: 4rem;
`

const Or = styled.hr`
  border-top: 1px solid ${props => props.theme.mainBackground};
  border-right: none;
  border-bottom: none;
  border-left: none;
  color: ${props => props.theme.mainBackground};
  overflow: visible;
  margin: 50px 0 5px 0;
  padding: 0;
  text-align: center;
  ::after {
    content: "OR"; /* pronounced "Section sign" */
    display: inline-block;
    font-size: 1.2em;
    font-weight: 700;
    position: relative;
    padding: 0 0.25em;
    top: -0.7em;
    background-color: ${props => props.theme.white};
  }
`

export default Login
