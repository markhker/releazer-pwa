import React, { useEffect, useState } from 'react'
import { Redirect } from '@reach/router'
import { Auth } from 'aws-amplify'
import Loader from './Loader'

const AuthRoute = ({ component: Component, location, ...rest }) => {
  const [isAuth, setIsAuth] = useState(undefined)

  useEffect(() => {
    getAuthUser()
  }, [])

  const getAuthUser = async () => {
    try {
      const userData = await Auth.currentAuthenticatedUser()
      const hasUserData = Boolean(userData.username || userData.id)
      setIsAuth(hasUserData)
    } catch (error) {
      console.log('error: ', error)
      setIsAuth(false)
    }
  }

  if (isAuth) {
    return <Component {...rest} />
  } else if (typeof isAuth === 'undefined') {
    return <Loader />
  } else {
    return <Redirect to={`/login?redirect=${location.pathname}`} noThrow />
  }
}

export default AuthRoute
