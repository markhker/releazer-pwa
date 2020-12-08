export default {
  apiGateway: {
    REGION: process.env.AWS_REGION,
    URL: process.env.API_GATEWAY_URL,
  },
  cognito: {
    REGION: process.env.AWS_REGION,
    USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
    APP_CLIENT_ID: process.env.COGNITO_APP_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.COGNITO_IDENTITY_POOL_ID,
  },
  social: {
    FB: process.env.FACEBOOK_ID,
  }
}
