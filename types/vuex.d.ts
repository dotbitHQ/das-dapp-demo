import { IAlertOptions } from '~/plugins/alert'
import Services from '~/services'

declare module 'vuex/types/index' {
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Store {
    $services: Services
    $alert: (options: IAlertOptions) => void
    $toast: (message: string, duration?: number) => void
  }
}
