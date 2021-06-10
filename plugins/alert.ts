import { Context } from '@nuxt/types'
import { TranslateResult } from 'vue-i18n'
import Dialog from '~/components/Dialog.vue'

export interface IAlertOptions {
  title: string | TranslateResult
  message: string
  actionButtonText?: string
  closeButton?: boolean
}

export default function ({ app }: Context, inject: Function) {
  inject('alert', (options: IAlertOptions) => {
    const _instance = new Dialog({
      propsData: {
        showing: true,
        actionButtonText: app.i18n.t('OK'),
        ...options
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
