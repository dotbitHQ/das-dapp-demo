const packageJson = require('./package.json')
const isProd = process.env.NODE_ENV !== 'development'

module.exports = {
  appNmae: packageJson.name,
  isProd,
  host: '0.0.0.0',
  port: process.env.PORT || 9800,
  domain: 'https://dapp-demo.da.services/',
  servicesApi: 'https://indexer.da.systems',
  identiconServe: 'https://identicons.da.systems/identicon/'
}
