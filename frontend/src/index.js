import React from 'react'
import ReactDOM from 'react-dom'
import Amplify from 'aws-amplify'

import config from './config'
import { StoreProvider } from './store'
import AppPage from './pages/app'

const dev = process.env.NODE_ENV === 'development'
const domain = dev ? 'localhost' : 'releazer.cyk.mx'

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    cookieStorage: {
      domain,
      path: '/',
      expires: 365,
      secure: !dev
    }
  },
  API: {
    endpoints: [
      {
        name: 'libraryid',
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
      {
        name: 'library',
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
      {
        name: 'getlibrary',
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
      {
        name: 'searchlibrary',
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
      {
        name: 'deletelibrary',
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
      {
        name: 'createuser',
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
      {
        name: 'getuser',
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
      {
        name: 'watcher',
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      }
    ]
  }
})

ReactDOM.render(
  <StoreProvider>
    <AppPage />
  </StoreProvider>,
  document.getElementById('root')
)
