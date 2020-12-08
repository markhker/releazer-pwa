import React, { useContext, useEffect } from 'react'
import { Auth, API } from 'aws-amplify'

import Button from './Button'
import useAsyncAction from '../hooks/useAsyncAction'
import { LOGIN_USER } from '../config/actions'
import { Store } from '../store'

const waitForInit = () => {
  return new Promise((resolve, reject) => {
    const hasFbLoaded = () => {
      window.FB ? resolve() : setTimeout(hasFbLoaded, 300)
    }
    hasFbLoaded()
  })
}

const FacebookButton = () => {
  const { state } = useContext(Store)
  const [ loginAction ] = useAsyncAction(LOGIN_USER)

  useEffect(() => {
    (async () => {
      await waitForInit()
    })()
  }, [])

  const statusChangeCallback = response => {
    if (response.status === 'connected') {
      handleResponse(response.authResponse)
    } else {
      handleError(response)
    }
  }

  const checkLoginState = () => {
    window.FB.getLoginStatus(statusChangeCallback)
  }

  const handleClick = () => {
    loginAction()
    window.FB.login(checkLoginState, { scope: 'email, public_profile', return_scopes: true })
  }

  const handleError = error => {
    console.log('Error in FB btn:', error)
  }

  const handleResponse = async data => {
    const { accessToken: token, expiresIn } = data
    const expires_at = expiresIn * 1000 + new Date().getTime()

    try {
      window.FB.api('/me', { fields: 'name, email' }, async response => {
        const user = {
          name: response.name,
          email: response.email,
          facebookId: response.id,
          picture: `https://graph.facebook.com/${response.id}/picture`
        }

        const fedResponse = await Auth.federatedSignIn(
          'facebook',
          { token, expires_at },
          user
        )

        const verifyUser = await API.post('createuser', '/createuser', {
          body: { email: response.email }
        })
        if (verifyUser.ok) {
          loginAction.success(verifyUser.data)
        } else {
          loginAction.fail(verifyUser)
        }
      })
    } catch (e) {
      loginAction.fail(e)
      handleError(e)
    }
  }

  return (
    <Button
      disabled={state.ui.isLoginLoading}
      onClick={handleClick}
      bgcolor='#3b5998'
    >
      Login with Facebook
    </Button>
  )
}

export default FacebookButton
