import { Context } from '@nuxt/types'
import Vue from 'vue'
import ABCWallet from 'abcwallet'
import WalletsConnect from '~/components/WalletsConnect.vue'
import { ME_KEYS } from '~/store/me'
import { DOMAIN, WALLETS } from '~/constant'
import errno from '~/constant/errno'
import { CHAIN_ID, CKB, ETH, TRON } from '~/constant/chain'
import { isABCWallet, loadScript, shrinkUnit } from '~/modules/tools'
import config from '~/config'
import { oneChainCKB, oneChainCore } from '~/modules/one-chain'

interface IMetaMaskJsonRpcResponse {
  id: string | undefined;
  jsonrpc: '2.0';
  method: string;
  result?: string;
  error?: Error;
}

interface ISendTrxParams {
  to: string,
  value: string,
  data?: string
}

export default class WalletSdk {
  context: Context
  walletsConnectInstance: Vue
  walletConnector: any
  walletLinkWeb3: any

  constructor (context: Context) {
    this.context = context
  }

  init () {
    const { store } = this.context.app
    const _walletName = store?.state.me.connectedAccount.walletName
    switch (_walletName) {
      case WALLETS.metaMask:
        this.metaMaskConnect()
        break
      case WALLETS.walletConnect:
        this.walletConnectConnect()
        break
      case WALLETS.coinbaseWallet:
        this.coinbaseWalletConnect()
        break
      case WALLETS.tronLink:
        this.tronLinkConnect()
        break
      case undefined:
        store?.commit(ME_KEYS.setLoggedIn, false)
        this.walletsConnect()
        break
    }
  }

  walletsConnect () {
    if (!this.walletsConnectInstance) {
      const _div = document.createElement('div')
      document.body.appendChild(_div)
      this.walletsConnectInstance = new WalletsConnect({
        propsData: {
          showing: false,
          i18n: this.context.app.i18n,
          $alert: this.context.app.$alert,
          $toast: this.context.app.$toast,
          $store: this.context.app.store
        }
      })
      this.walletsConnectInstance.$mount(_div)
    }
    this.walletsConnectInstance.$on('close', () => {
      this.closeWalletsConnect()
    })
    this.walletsConnectInstance.$on('abcWalletConnect', () => {
      this.abcWalletConnect()
    })
    this.walletsConnectInstance.$on('metaMaskConnect', () => {
      this.metaMaskConnect()
    })
    this.walletsConnectInstance.$on('walletConnectConnect', () => {
      this.walletConnectConnect()
    })
    this.walletsConnectInstance.$on('coinbaseWalletConnect', () => {
      this.coinbaseWalletConnect()
    })
    this.walletsConnectInstance.$on('tronLinkConnect', () => {
      this.tronLinkConnect()
    })
    ;(this.walletsConnectInstance as any).showing = true
  }

  closeWalletsConnect () {
    if (this.walletsConnectInstance) {
      ;(this.walletsConnectInstance as any).showing = false
    }
  }

  async signData (data: string): Promise<Error | string | undefined> {
    const { store } = this.context.app
    const _walletName = store?.state.me.connectedAccount.walletName
    switch (_walletName) {
      case WALLETS.metaMask:
        return await this.metaMaskSignData(data)
      case WALLETS.walletConnect:
        return await this.walletConnectSignData(data)
      case WALLETS.coinbaseWallet:
        return await this.coinbaseWalletSignData(data)
      case WALLETS.tronLink:
        return await this.tronLinkSignData(data)
      case undefined:
        store?.commit(ME_KEYS.setLoggedIn, false)
        this.walletsConnect()
        break
    }
  }

  async sendTrx (data: ISendTrxParams): Promise<Error | string | undefined> {
    const { store } = this.context.app
    const _walletName = store?.state.me.connectedAccount.walletName
    switch (_walletName) {
      case WALLETS.abcWallet:
        return await this.abcWalletSendTrx(data)
      case WALLETS.metaMask:
        return await this.metaMaskSendTrx(data)
      case WALLETS.walletConnect:
        return await this.walletConnectSendTrx(data)
      case WALLETS.coinbaseWallet:
        return await this.coinbaseWalletSendTrx(data)
      // case WALLETS.tronLink:
      //   return await this.tronLinkSendTrx(data)
    }
  }

  refreshPageAfterLogin (): (address: string) => void {
    const { store } = this.context.app
    const oldAddress = store?.state.me.connectedAccount.address
    return function (address: string) {
      if (oldAddress.toUpperCase() !== address.toUpperCase()) {
        window.location.reload()
      }
    }
  }

  async abcWalletConnect () {
    const { i18n, $alert, store } = this.context.app
    if (isABCWallet()) {
      const _refreshPageAfterLogin = this.refreshPageAfterLogin()
      try {
        const accounts = (await ABCWallet.request({
          namespace: CKB.symbol.toLowerCase(),
          method: 'offerIdentity',
          params: {}
        })).addresses
        store?.commit(ME_KEYS.setConnectedAccount, {
          address: accounts[0],
          chain: CKB,
          walletName: WALLETS.abcWallet
        })
        this.closeWalletsConnect()
        _refreshPageAfterLogin(accounts[0])
      }
      catch (err) {
        console.error(err)
        if (err.code !== errno.abcWalletUserCancelTheAction) {
          $alert({
            title: i18n.t('Error'),
            message: `${err.code}: ${err.message}`
          })
        }
      }
    }
    else {
      $alert({
        title: i18n.t('Error'),
        message: (i18n.t('请安装 ABC Wallet!') as string)
      })
    }
  }

  async metaMaskConnect () {
    const { ethereum } = window
    const { i18n, $alert, store } = this.context.app
    if (typeof ethereum !== 'undefined') {
      const _refreshPageAfterLogin = this.refreshPageAfterLogin()
      try {
        const accounts = await ethereum.enable()
        store?.commit(ME_KEYS.setConnectedAccount, {
          address: accounts[0],
          chain: ETH,
          walletName: WALLETS.metaMask
        })
        this.closeWalletsConnect()
        _refreshPageAfterLogin(accounts[0])
      }
      catch (err) {
        console.error(err)
        if (err.code !== errno.metaMaskUserRejectedAccountAccess && err.code !== errno.metaMaskUserDeniedMessageSignature) {
          $alert({
            title: i18n.t('Error'),
            message: `${err.code}: ${err.message}`
          })
        }
      }
    }
    else {
      $alert({
        title: i18n.t('Error'),
        message: (i18n.t('请安装 MetaMask!') as string)
      })
    }
  }

  async walletConnectConnect () {
    const { i18n, $alert, store } = this.context.app
    const _refreshPageAfterLogin = this.refreshPageAfterLogin()
    await loadScript('/js/walletconnect-client.min.js', 'walletconnect-client')
    await loadScript('/js/walletconnect-qrcode-modal.min.js', 'walletconnect-qrcode-modal')
    const { WalletConnect, WalletConnectQRCodeModal } = window
    try {
      // eslint-disable-next-line new-cap
      this.walletConnector = new WalletConnect.default({
        bridge: 'https://bridge.walletconnect.org',
        qrcodeModal: WalletConnectQRCodeModal.default
      })
      if (!this.walletConnector.connected) {
        this.walletConnector.on('connect', (error: Error, payload: any) => {
          if (error) {
            $alert({
              title: i18n.t('Error'),
              message: error
            })
            return
          }
          const { accounts } = payload.params[0]
          store?.commit(ME_KEYS.setConnectedAccount, {
            address: accounts[0],
            chain: ETH,
            walletName: WALLETS.walletConnect
          })
          this.closeWalletsConnect()
          _refreshPageAfterLogin(accounts[0])
        })
        await this.walletConnector.createSession()
      }
      else {
        const { accounts } = this.walletConnector
        store?.commit(ME_KEYS.setConnectedAccount, {
          address: accounts[0],
          chain: ETH,
          walletName: WALLETS.walletConnect
        })
        this.closeWalletsConnect()
        _refreshPageAfterLogin(accounts[0])
      }
    }
    catch (err) {
      console.error(err)
      if (err.code !== errno.metaMaskUserDeniedMessageSignature && err.code !== errno.metaMaskUserRejectedAccountAccess) {
        $alert({
          title: i18n.t('Error'),
          message: `${err.code}: ${err.message}`
        })
      }
    }
  }

  async coinbaseWalletConnect () {
    const { i18n, $alert, store } = this.context.app
    await loadScript('/js/web3.min.js', 'web3js')
    const { Web3 } = window
    const { WalletLink } = await import('walletlink')
    const walletLink = new WalletLink({
      appName: config.appNmae,
      appLogoUrl: `${DOMAIN}/favicon.ico`,
      darkMode: false
    })
    const walletLinkEthereum = walletLink.makeWeb3Provider('https://mainnet.infura.io/v3/ff0db0391cc74735a160f2d7acae5ad4', CHAIN_ID.eth)
    this.walletLinkWeb3 = new Web3(walletLinkEthereum)
    const _refreshPageAfterLogin = this.refreshPageAfterLogin()
    try {
      const accounts = await walletLinkEthereum.enable()
      store?.commit(ME_KEYS.setConnectedAccount, {
        address: accounts[0],
        chain: ETH,
        walletName: WALLETS.coinbaseWallet
      })
      this.closeWalletsConnect()
      _refreshPageAfterLogin(accounts[0])
    }
    catch (err) {
      console.error(err)
      if (err.code !== errno.metaMaskUserRejectedAccountAccess && err.code !== errno.metaMaskUserDeniedMessageSignature) {
        $alert({
          title: i18n.t('Error'),
          message: err
        })
      }
    }
  }

  async tronLinkConnect () {
    const { tronWeb } = window
    const { i18n, $alert, store } = this.context.app
    if (typeof tronWeb !== 'undefined') {
      const _refreshPageAfterLogin = this.refreshPageAfterLogin()
      try {
        const account = await tronWeb.defaultAddress.base58
        store?.commit(ME_KEYS.setConnectedAccount, {
          address: account,
          chain: TRON,
          walletName: WALLETS.tronLink
        })
        this.closeWalletsConnect()
        _refreshPageAfterLogin(account)
      }
      catch (err) {
        console.error(err)
        $alert({
          title: i18n.t('Error'),
          message: err
        })
      }
    }
    else {
      $alert({
        title: i18n.t('Error'),
        message: (i18n.t('请安装 TronLink!') as string)
      })
    }
  }

  async metaMaskSignData (data: string): Promise<Error | string | undefined> {
    await this.metaMaskConnect()
    const { store } = this.context.app
    const _signAccount = store?.state.me.connectedAccount.address
    return new Promise((resolve, reject) => {
      const { ethereum } = window
      ethereum.sendAsync({
        method: 'personal_sign',
        params: [data, _signAccount]
      }, (err: Error, res: IMetaMaskJsonRpcResponse) => {
        if (err) {
          console.error(err)
          reject(err)
        }
        if (res.error) {
          console.error(err)
          reject(res.error)
        }
        let result = <string>res.result
        let v = Number.parseInt(result.slice(-2), 16)
        if (v >= 27) {
          v -= 27
        }
        result = result.slice(2, -2) + v.toString(16).padStart(2, '0')
        resolve(result)
      })
    })
  }

  async walletConnectSignData (data: string): Promise<Error | string | undefined> {
    await this.walletsConnect()
    const { store } = this.context.app
    const _signAccount = store?.state.me.connectedAccount.address
    return new Promise((resolve, reject) => {
      this.walletConnector
        .signPersonalMessage([data, _signAccount])
        .then((result: string) => {
          resolve(result)
        })
        .catch((err: any) => {
          console.error(err)
          if (err.message === 'MetaMask Typed Message Signature: User denied message signature.') {
            err.code = errno.metaMaskUserDeniedMessageSignature
          }
          reject(err)
        })
    })
  }

  async coinbaseWalletSignData (data: string): Promise<Error | string | undefined> {
    await this.coinbaseWalletConnect()
    const { store } = this.context.app
    const _signAccount = store?.state.me.connectedAccount.address
    return new Promise((resolve, reject) => {
      this.walletLinkWeb3.currentProvider.sendAsync({
        method: 'personal_sign',
        params: [data, _signAccount]
      }, (err: Error, res: IMetaMaskJsonRpcResponse) => {
        if (err) {
          console.error(err)
          reject(err)
        }
        if (res.error) {
          console.error(err)
          reject(res.error)
        }
        resolve(res.result)
      })
    })
  }

  async tronLinkSignData (data: string): Promise<Error | string | undefined> {
    await this.tronLinkConnect()
    return new Promise((resolve, reject) => {
      const { tronWeb } = window
      tronWeb.trx.sign(tronWeb.toHex(data))
        .then((res: any) => {
          console.log(res)
          resolve(res)
        }).catch((err: Error) => {
          console.error(err)
          reject(err)
        })
    })
  }

  async abcWalletSendTrx ({ to, value, data }: ISendTrxParams): Promise<Error | string | undefined> {
    await this.abcWalletConnect()
    const { store } = this.context.app
    const _from = store?.state.me.connectedAccount.address
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const CKB_RPC_NODE = new oneChainCore.RPCNode({
          chainId: 'testnet',
          chainType: 'CKB',
          baseUrl: 'https://test-ckb.abcwallet.com/api'
        })

        const provider = new oneChainCKB.CKB({
          rpcnode: CKB_RPC_NODE,
          keypairs: [],
          logger: console
        })

        console.log(shrinkUnit(value, CKB.decimals))

        const trxObj = await provider.buildTransaction({
          froms: [{
            address: _from
          }],
          tos: [{
            address: to,
            value
          }],
          changeAddress: _from,
          memos: []
        })
        console.log('trxObj', trxObj)

        trxObj.edit({
          fee: 100000000
        })

        const signedTrx = await (ABCWallet as any).ckb.sign({
          rawTransaction: trxObj.rawTransaction,
          unspents: trxObj.inputs
        })
        console.log('Signed transaction:', signedTrx)

        const trxId = await this.context.app.$services.sendTrx(signedTrx.transaction)
        // console.log('Transaction ID:', trxId)
        resolve(trxId)
      }
      catch (err) {
        console.error(err)
        reject(err)
      }
    })
  }

  async metaMaskSendTrx ({ to, value, data }: ISendTrxParams): Promise<Error | string | undefined> {
    await this.metaMaskConnect()
    await loadScript('/js/web3.min.js', 'web3js')
    const { ethereum, Web3 } = window
    const { store } = this.context.app
    const _from = store?.state.me.connectedAccount.address
    const _data = data ? Web3.utils.utf8ToHex(data) : data
    const _value = Web3.utils.numberToHex(value)
    return new Promise((resolve, reject) => {
      ethereum.sendAsync({
        method: 'eth_sendTransaction',
        params: [{
          from: _from,
          to,
          value: _value,
          data: _data,
          gas: Web3.utils.numberToHex('30000'),
          gasPrice: Web3.utils.numberToHex('100000000000')
        }]
      }, (err: Error, res: IMetaMaskJsonRpcResponse) => {
        if (err) {
          console.error(err)
          reject(err)
          return
        }
        resolve(res.result)
      })
    })
  }

  async walletConnectSendTrx ({ to, value, data }: ISendTrxParams): Promise<Error | string | undefined> {
    await this.walletConnectConnect()
    await loadScript('/js/web3.min.js', 'web3js')
    const { Web3 } = window
    const { store } = this.context.app
    const _from = store?.state.me.connectedAccount.address
    const _data = Web3.utils.utf8ToHex(data)
    const _value = Web3.utils.numberToHex(value)
    return new Promise((resolve, reject) => {
      this.walletConnector.sendTransaction({
        from: _from,
        to,
        value: _value,
        data: _data
      })
        .then((res: string) => {
          resolve(res)
        })
        .catch((err: Error) => {
          console.error(err)
          console.error(err.message)
          reject(err)
        })
    })
  }

  async coinbaseWalletSendTrx ({ to, value, data }: ISendTrxParams): Promise<Error | string | undefined> {
    await this.coinbaseWalletConnect()
    await loadScript('/js/web3.min.js', 'web3js')
    const { Web3 } = window
    const { store } = this.context.app
    const _from = store?.state.me.connectedAccount.address
    const _data = Web3.utils.utf8ToHex(data)
    const _value = Web3.utils.numberToHex(value)
    return new Promise((resolve, reject) => {
      this.walletLinkWeb3.currentProvider.sendAsync({
        method: 'eth_sendTransaction',
        params: [{
          from: _from,
          to,
          value: _value,
          data: _data
        }]
      }, (err: Error, res: IMetaMaskJsonRpcResponse) => {
        if (err) {
          console.error(err)
          reject(err)
          return
        }
        resolve(res.result)
      })
    })
  }

  // async tronLinkSendTrx ({ to, value, data }: ISendTrxParams): Promise<Error | string | undefined> {
  //
  // }
}
