import { Context } from '@nuxt/types'
import createPersistedState from 'vuex-persistedstate'
import { VUEX_PERSISTEDSTATE_KEY } from '~/constant'

export default ({ store }: Context) => {
  createPersistedState({
    key: VUEX_PERSISTEDSTATE_KEY,
    paths: [
      'me.connectedAccount',
      'me.loggedIn'
    ]
  })(store)
}
