import { Context } from '@nuxt/types'
import Toast from '~/components/Toast.vue'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function (context: Context, inject: Function) {
  inject('toast', (message: string, duration?: number) => {
    const _instance = new Toast({
      propsData: {
        showing: true,
        message,
        duration
      }
    })
    const _vm = _instance.$mount()
    _instance.$on('close', () => {
      _instance.showing = false
      document.body.removeChild(_vm.$el)
    })
    document.body.appendChild(_vm.$el)
  })
}
