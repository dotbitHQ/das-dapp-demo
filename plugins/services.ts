import { Context } from '@nuxt/types'
import Services from '~/services'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function (context: Context, inject: Function) {
  const services = new Services()
  inject('services', services)
}
