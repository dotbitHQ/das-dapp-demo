import config from '~/config'

export const DOMAIN = config.domain

export const IDENTICON_SERVE = config.identiconServe

export const VUEX_PERSISTEDSTATE_KEY = config.appNmae

export const TOAST_DURATION_TIME = 1500

export const WALLETS = {
  abcWallet: 'ABC Wallet',
  metaMask: 'MetaMask',
  walletConnect: 'WalletConnect',
  coinbaseWallet: 'Coinbase Wallet',
  tronLink: 'TronLink'
}
