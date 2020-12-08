import React, { useContext } from 'react'
import { Redirect } from '@reach/router'
import queryString from 'query-string'

import { Store } from '../store'

const NoAuthRoute = ({ component: Component, location, ...rest }) => {
  const { state } = useContext(Store)
  const isAuth = state.isAuth

  const values = queryString.parse(location.search)
  const redirect = values.redirect || '/releases'

  return !isAuth ? <Component {...rest} /> : <Redirect to={redirect} noThrow />
}

export default NoAuthRoute
