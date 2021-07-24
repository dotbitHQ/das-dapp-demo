const packageJson = require('./package.json')
const config = require('./config')

function generateApp (env, port) {
  const isProd = env === 'production'
  const appName = isProd ? packageJson.name : `${packageJson.name}-${env}`

  return {
    name: appName,
    script: 'node_modules/.bin/nuxt',
    args: ['start'],
    instances: 1,
    exec_mode: 'cluster',
    watch: false,
    error_file: `logs/${appName}.stderr.log'`,
    out_file: `logs/${appName}.stdout.log`,
    log_date_format: 'MM-DD HH:mm:ss',
    env: {
      NODE_ENV: 'production',
      PORT: port
    }
  }
}

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    generateApp('production', config.port)
  ]
}
