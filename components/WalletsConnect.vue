<template>
  <BottomSheet
    :showing="showing"
    :title="loggedIn ? i18n.t('切换钱包') : i18n.t('连接钱包')"
    :closeButton="loggedIn"
    @close="onClose"
  >
    <ul class="wallets-connect__select-wallet-list">
      <li
        v-for="wallet in walletList"
        :key="wallet.name"
        class="wallets-connect__select-wallet-list__item"
        :class="{ 'wallets-connect__select-wallet-list__no-support': !wallet.supported }"
        @click="onLogin(wallet)"
      >
        <span class="wallets-connect__select-wallet-list__wallet-info">
          <IconImage
            class="wallets-connect__select-wallet-list__logo"
            :url="wallet.logo"
            :alt="wallet.name"
            :size="40"
          />
          {{ wallet.name }}
        </span>
        <Iconfont name="arrow-right" color="#11142D" />
      </li>
    </ul>
  </BottomSheet>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import VueI18n, { IVueI18n } from 'vue-i18n'
import { mapState, Store } from 'vuex'
import BottomSheet from '~/components/BottomSheet.vue'
import IconImage from '~/components/icon/IconImage.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import { IAlertOptions } from '~/plugins/alert'
import { WALLETS } from '~/constant'
import { ME_KEYS } from '~/store/me'

export default Vue.extend({
  name: 'WalletsConnect',
  components: {
    Iconfont,
    IconImage,
    BottomSheet
  },
  model: {
    prop: 'showing',
    event: 'close'
  },
  props: {
    showing: {
      type: Boolean,
      required: false
    },
    i18n: {
      type: Object as PropType<VueI18n & IVueI18n>,
      default: () => (({} as VueI18n & IVueI18n))
    },
    $alert: {
      type: Function as PropType<(options: IAlertOptions) => void>,
      default: () => {}
    },
    $toast: {
      type: Function as PropType<(message: string, duration?: number) => void>,
      default: () => {}
    },
    $store: {
      type: Object as PropType<Store<any>>,
      default: () => ({} as Store<any>)
    }
  },
  data () {
    return {
      walletList: [
        {
          name: WALLETS.metaMask,
          logo: '/images/components/metamask-wallet-logo.png',
          supported: true
        },
        {
          name: WALLETS.abcWallet,
          logo: '/images/components/abcwallet-logo.png',
          supported: false
        },
        {
          name: WALLETS.walletConnect,
          logo: '/images/components/walletConnect-wallet-logo.png',
          supported: false
        },
        {
          name: WALLETS.coinbaseWallet,
          logo: '/images/components/wallet_coinbase.png',
          supported: false
        },
        {
          name: WALLETS.tronLink,
          logo: '/images/components/wallet_tronlink.png',
          supported: false
        }
      ]
    }
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace
    }),
    loggedIn (): boolean {
      return this.me.loggedIn
    }
  },
  methods: {
    onLogin (wallet: { name: string, logo: string, supported: boolean }) {
      if (!wallet.supported) {
        this.$toast((this.i18n.t('即将支持') as string))
        return
      }
      switch (wallet.name) {
        case WALLETS.abcWallet:
          this.$emit('abcWalletConnect')
          break
        case WALLETS.metaMask:
          this.$emit('metaMaskConnect')
          break
        case WALLETS.walletConnect:
          this.$emit('walletConnectConnect')
          break
        case WALLETS.coinbaseWallet:
          this.$emit('coinbaseWalletConnect')
          break
        case WALLETS.tronLink:
          this.$emit('tronLinkConnect')
          break
      }
    },
    onClose () {
      this.$emit('close', false)
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'assets/variables';

.wallets-connect__select-wallet-list {
  padding: 24px 0 34px 0;
  height: 460px;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0 !important
  }
}

.wallets-connect__select-wallet-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border: $container-border;
  border-radius: 16px;
  margin-bottom: 16px;
  cursor: pointer;

  &:hover {
    background: #F6F7F9;
  }
}

.wallets-connect__select-wallet-list__no-support {
  filter: grayscale(100%);
  cursor: no-drop;
  color: $assist-font-color;

  &:hover {
    background: $white;
  }
}

.wallets-connect__select-wallet-list__logo {
  margin-right: 16px;
}

.wallets-connect__select-wallet-list__wallet-info {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}
</style>
