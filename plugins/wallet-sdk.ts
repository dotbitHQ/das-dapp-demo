import { Context } from '@nuxt/types'
import WalletSdk from '~/modules/WalletSdk'

export default function (context: Context, inject: Function) {
  const _walletSdk = new WalletSdk(context)
  _walletSdk.init()
  inject('walletSdk', _walletSdk)
}
