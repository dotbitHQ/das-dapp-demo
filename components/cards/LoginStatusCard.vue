<template>
  <div class="login-status-card">
    <span
      class="login-status-card__account"
      @click="onConnectWallet"
    >
      <template v-if="loggedIn">
        <Iconfont
          class="login-status-card__account-icon"
          :name="connectedAccount.chain.icon"
          size="20"
        />
        <span class="login-status-card__address">
          {{ collapseString(connectedAccount.address, 5, 5) }}
        </span>
      </template>
      <span v-else>{{ $t('连接钱包') }}</span>
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { collapseString } from '~/modules/tools'
import Iconfont from '~/components/icon/Iconfont.vue'

export default Vue.extend({
  name: 'LoginStatusCard',
  components: {
    Iconfont
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace
    }),
    loggedIn (): boolean {
      return this.me.loggedIn
    },
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    }
  },
  methods: {
    collapseString,
    onConnectWallet () {
      this.$walletSdk.walletsConnect()
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'assets/variables';

.login-status-card {
  display: inline-block;
  background: $normal-color;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
}

.login-status-card__account {
  color: $assist-font-color;
  font-weight: 600;
}

.login-status-card__account-icon {
  margin-right: 4px;
}

.login-status-card__address {
  color: $primary-font-color;
}
</style>
