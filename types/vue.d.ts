import Services from '~/services'
import { IAlertOptions } from '~/plugins/alert'
import WalletSdk from '~/modules/WalletSdk'

declare module 'vue/types/vue' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Vue {
    $services: Services
    $alert: (options: IAlertOptions) => void
    $toast: (message: string, duration?: number) => void
    $walletSdk: WalletSdk
  }
}
