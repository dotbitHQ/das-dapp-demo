import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { augmentKeys } from '~/modules/tools'
import { IMainChain } from '~/constant/chain'

export interface IConnectedAccount {
  address: string
  chain: IMainChain,
  walletName: string
}

const keys = {
  namespace: 'me',
  // mutations
  setConnectedAccount: 'setConnectedAccount',
  setLoggedIn: 'setLoggedIn'
  // actions
}

export const state = () => ({
  connectedAccount: {
    address: ''
  } as IConnectedAccount,
  loggedIn: false
})

export type MeState = ReturnType<typeof state>

export const mutations: MutationTree<MeState> = {
  [keys.setConnectedAccount]: (state, connectedAccount: IConnectedAccount) => {
    state.connectedAccount = connectedAccount
    state.loggedIn = true
  },
  [keys.setLoggedIn]: (state, status: boolean) => {
    state.loggedIn = status
  }
}

export const actions: ActionTree<MeState, MeState> = {

}

export const ME_KEYS = augmentKeys(keys, keys.namespace)
