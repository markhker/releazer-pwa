import React, { useContext, useEffect } from 'react'
import { Router } from '@reach/router'
import { ThemeProvider } from 'styled-components'
import { Auth, API } from 'aws-amplify'

import App from '../components/App'
import AuthRoute from '../components/AuthRoute'
import NoAuthRoute from '../components/NoAuthRoute'
import * as Routes from '../routes'
import useToggleAction from '../hooks/useToggleAction'
import useAsyncAction from '../hooks/useAsyncAction'
import { LOGIN_USER, NOTIF_TOAST } from '../config/actions'
import config from '../config'
import { Store } from '../store'
import { lightTheme } from '../styles/themes'

const AppPage = () => {
  const { state } = useContext(Store)
  const [loginAction] = useAsyncAction(LOGIN_USER)
  const [notifToast] = useToggleAction(NOTIF_TOAST)

  useEffect(() => {
    init()
  }, [])

  const loadFacebookSDK = () => {
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) { return }
      js = d.createElement(s); js.id = id
      js.src = 'https://connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    }(document, 'script', 'facebook-jssdk'))

    window.fbAsyncInit = () => {
      window.FB.init({
        appId: config.social.FB,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v3.1'
      })
    }
  }

  const init = async () => {
    loadFacebookSDK()
    await navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/OneSignalSDKWorker.js`)

    try {
      loginAction()
      await Auth.currentAuthenticatedUser()
      const userData = await API.get('getuser', '/getuser')
      if (userData.ok) {
        if (Notification.permission === 'default') {
          notifToast.open()
        } else {
        }
        loginAction.success(userData.data)
      } else {
        loginAction.fail(userData)
      }
    } catch (e) {
      loginAction.fail(e.message)
    }
  }

  return (
    <ThemeProvider theme={lightTheme}>
      <Router>
        <App path='/'>
          <Routes.HomePage path='/' />
          <NoAuthRoute path='login' component={Routes.LoginPage} />
          <AuthRoute path='releases' component={Routes.ReleasesPage} />
          <AuthRoute path='library/:id' component={Routes.LibraryPage} />
        </App>
      </Router>
    </ThemeProvider>
  )
}

export default AppPage
