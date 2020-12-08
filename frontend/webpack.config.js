const commonConfig = require('./config/webpack.common')
const { merge } = require('webpack-merge')

const addons = (/* string | string[] */ addonsArg) => {
  let addons = [...[addonsArg]]
    .filter(Boolean)

  return addons.map(addonName =>
    require(`./config/addons/webpack.${addonName}.js`)
  )
}

module.exports = env => {
  const envConfig = require(`./config/webpack.${env.env}.js`)

  const mergedConfig = merge(
    commonConfig,
    envConfig,
    ...addons(env.addons)
  )

  return mergedConfig
}
