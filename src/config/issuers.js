const { getConfig } = require('./index')

const config = getConfig({
  development: {
    name: 'development',
    account: '1234',
    agency: '123',
    wallet: '13',
  },

  production: {
    name: process.env.DEFAULT_ISSUER_NAME,
    account: process.env.DEFAULT_ISSUER_ACCOUNT,
    agency: process.env.DEFAULT_ISSUER_AGENCY,
    wallet: process.env.DEFAULT_ISSUER_WALLET,
  },

  test: {
    name: 'development',
    account: '1234',
    agency: '123',
    wallet: '13',
  },
})

module.exports = config
