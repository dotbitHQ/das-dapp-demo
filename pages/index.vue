<template>
  <div class="page-index">
    <div class="page-index__header">
      <img
        class="page-index__header__logo"
        src="/images/explorer/das-logo.png"
        alt="logo"
      >
      <LoginStatusCard />
    </div>
    <h1 class="page-index__title">
      {{ $t('DAS 转账') }}
    </h1>
    <div class="page-index__desc">
      {{ $t('使用更易读的 DAS 账号进行加密货币转账') }}
    </div>
    <div class="page-index__container">
      <div class="page-index__select">
        {{ $t('转账') }}
        <PaymentTokenSelect
          v-if="connectedAccount.chain"
          v-model="paymentToken"
          :currentChain="connectedAccount.chain.chainId"
          :options="tokens"
        />
      </div>
      <div class="page-index__split-line" />
      <ValidationObserver
        ref="transferForm"
        tag="form"
        @submit.prevent="onSubmit"
      >
        <label class="page-index__label">
          {{ $t('收款地址') }}
        </label>
        <div class="page-index__input">
          <TextInput
            v-model="address"
            :placeholder="$t('DAS 账号或地址')"
            :errorMessages="addressErrors"
            @input="onChangeAddress"
          />
          <span
            v-show="currentChainParsingRecords.length > 0"
            class="page-index__account"
            @click="switchParsingRecords"
          >
            <span
              v-if="toLabel || toAddress"
              class="page-index__account-label"
            >
              {{ collapseString(toAddress, 5, 5) }}
            </span>
            <IconImage
              class="page-index__account-logo"
              :url="`${IDENTICON_SERVE}${address}`"
              :alt="address"
              :size="22"
              rounded
            />
          </span>
          <div
            v-if="showParsingRecords"
            class="page-index__parsing-records"
          >
            <span class="page-index__parsing-records__label">
              {{ currentChainParsingRecords.length > 1 ? $t('存在多个解析结果，请选择') : $t('解析结果') }}
            </span>
            <ul>
              <li
                v-for="(record, index) in currentChainParsingRecords"
                :key="`address${index}`"
                class="page-index__parsing-records__item"
                @click="selectAddress(record)"
              >
                <span
                  class="page-index__parsing-records__margin-right-8"
                  :class="{ 'page-index__parsing-records__width-24': !!toAddress }"
                >
                  <Iconfont
                    v-if="toAddress.toUpperCase() === record.value.toUpperCase()"
                    name="check"
                    color="#22C493"
                  />
                </span>
                <div>
                  <div class="page-index__parsing-records__address">
                    {{ record.value }}
                  </div>
                  <span
                    v-if="record.label"
                    class="page-index__parsing-records__tag"
                  >
                    {{ record.label }}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <label class="page-index__label">
          {{ $t('金额') }}
        </label>
        <ValidationProvider
          v-if="paymentToken.symbol === CKB.symbol"
          v-slot="{ errors }"
          :name="$t('金额')"
          rules="required|minAmount:61"
        >
          <TextInput
            v-model="amount"
            inputmode="decimal"
            placeholder="0"
            :errorMessages="errors"
          />
        </ValidationProvider>
        <ValidationProvider
          v-else
          v-slot="{ errors }"
          :name="$t('金额')"
          :rules="`required|minAmount:${shrinkUnit(1, paymentToken.decimals, paymentToken.decimals)}`"
        >
          <TextInput
            v-model="amount"
            inputmode="decimal"
            placeholder="0"
            :errorMessages="errors"
          />
        </ValidationProvider>
        <Button
          class="page-index__submit"
          :loading="submitLoading"
          type="submit"
          block
          success
        >
          {{ $t('转账') }}
        </Button>
      </ValidationObserver>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { ValidationObserver, ValidationProvider, validate } from 'vee-validate'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { CKB, ETH, IMainChain } from '~/constant/chain'
import LoginStatusCard from '~/components/cards/LoginStatusCard.vue'
import PaymentTokenSelect from '~/components/PaymentTokenSelect.vue'
import Button from '~/components/Button.vue'
import TextInput from '~/components/form/TextInput.vue'
import { IRecord } from '~/services'
import { IDENTICON_SERVE } from '~/constant'
import errno from '~/constant/errno'
import { collapseString, expandUnit, shrinkUnit } from '~/modules/tools'
import IconImage from '~/components/icon/IconImage.vue'
import Iconfont from '~/components/icon/Iconfont.vue'

interface IResult {
  valid: boolean
  errors: string[]
  failedRules: {
    [x: string]: string
  }
}

enum ParsingRecordType {
  address = 'address',
  profile = 'profile'
}

export default Vue.extend({
  name: 'Index',
  components: {
    LoginStatusCard,
    PaymentTokenSelect,
    ValidationProvider,
    ValidationObserver,
    Button,
    TextInput,
    IconImage,
    Iconfont
  },
  data () {
    return {
      CKB,
      IDENTICON_SERVE,
      paymentToken: ETH,
      tokens: [ETH, CKB] as IMainChain[],
      address: '',
      toAddress: '',
      toLabel: '',
      amount: '',
      parsingRecords: [] as IRecord[],
      currentChainParsingRecords: [] as IRecord[],
      addressErrors: [] as string[],
      showParsingRecords: false,
      submitLoading: false
    }
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    }
  },
  methods: {
    shrinkUnit,
    collapseString,
    async onSubmit () {
      const verified = await (this.$refs.transferForm as HTMLFormElement).validate()
      const addressVerified: IResult = await validate(this.toAddress, `required|address:${this.paymentToken.chainId}`, {
        name: (this.$t('收款地址') as string)
      })
      if (!addressVerified.valid) {
        this.addressErrors = addressVerified.errors
        return
      }

      if (!verified) {
        return
      }

      try {
        this.submitLoading = true
        await this.$walletSdk.sendTrx({
          to: this.toAddress,
          value: expandUnit(this.amount, this.paymentToken.decimals)
        })
        this.$toast('👌 ' + this.$t('交易已发送'))
        this.amount = ''
        ;(this.$refs.transferForm as HTMLFormElement).reset()
      }
      catch (err) {
        console.error(err)
        if (err.code !== errno.metaMaskUserRejectedAccountAccess && err.code !== errno.metaMaskUserDeniedMessageSignature && err.code !== errno.abcWalletUserCancelTheAction) {
          this.$alert({
            title: this.$t('错误'),
            message: `${err.code}: ${err.message}`
          })
        }
      }
      finally {
        this.submitLoading = false
      }
    },
    onChangeAddress (value: string) {
      this.addressErrors = []
      this.parsingRecords = []
      this.toAddress = ''
      this.toLabel = ''
      this.showParsingRecords = false
      const isDasAccount = /\.bit$/.test(value)
      if (isDasAccount && value.length > 2) {
        this.address = this.address.toLowerCase()
        this.searchAccount(value.toLowerCase())
      }
      else if (value.length > 20) {
        validate(value, `required|address:${this.paymentToken.chainId}`, {
          name: (this.$t('收款地址') as string)
        })
          .then((result: IResult) => {
            if (result.valid) {
              this.toAddress = value
            }
            else {
              this.addressErrors = result.errors
            }
          })
      }
    },
    async searchAccount (value: string) {
      try {
        const res = await this.$services.searchAccount(value)
        if (res && res.account_data) {
          this.parsingRecords = res.account_data.records
          this.currentChainParsingRecords = this.parsingRecords.filter((record: IRecord) => {
            return record.type === ParsingRecordType.address && record.key === String(this.paymentToken.chainId)
          })
          if (this.currentChainParsingRecords.length > 0) {
            this.showParsingRecords = true
          }
          else {
            this.$toast(`无 ${this.paymentToken.symbol} 相关解析记录`)
          }
        }
      }
      catch (err) {
        console.error(err)
        if (err.code === errno.rpcApiErrAccountNotExist) {
          this.addressErrors = [(this.$t('账号不存在') as string)]
        }
      }
    },
    selectAddress (record: IRecord) {
      this.toAddress = record.value
      this.toLabel = record.label
      this.showParsingRecords = false
    },
    switchParsingRecords () {
      this.showParsingRecords = !this.showParsingRecords
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'assets/variables';

.page-index {
  position: relative;
  flex: 1;
  padding: 16px 12px 0 12px;
}

.page-index__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-index__header__logo {
  display: inline-block;
  width: 72px;
  height: 24px;
}

.page-index__title {
  margin: 36px 0 8px 0;
  font-size: 32px;
  font-weight: bold;
  color: $primary-font-color;
  text-align: center;
}

.page-index__desc {
  margin-bottom: 32px;
  font-size: 16px;
  font-weight: 400;
  color: #15212F;
  line-height: 22px;
  text-align: center;
}

.page-index__container {
  padding: 32px 16px;
  border: $container-border;
  border-radius: 16px;
  box-shadow: $container-outer-box-shadow;
}

.page-index__select {
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  color: $primary-font-color;
}

.page-index__split-line {
  margin-top: 24px;
  border-bottom: 1px #F7F7F7 solid;
}

.page-index__label {
  margin-top: 32px;
  margin-bottom: 8px;
  display: inline-block;
  font-weight: 600;
}

.page-index__input {
  position: relative;
}

.page-index__account {
  position: absolute;
  display: flex;
  align-items: center;
  top: 0;
  right: 16px;
  cursor: pointer;
  height: 58px;
}

.page-index__account-label {
  padding: 1px 4px;
  border: 1px solid #E6E9F7;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #2471FE;
  background: $white;
}

.page-index__account-logo {
  margin-left: 6px;
}

.page-index__parsing-records {
  position: absolute;
  left: 0;
  right: 0;
  margin-top: 12px;
  padding: 12px;
  box-shadow: 0 22px 14px 0 rgb(0 0 0 / 7%);
  border: 1px solid #DBDEEB;
  border-radius: 10px;
  background: $white;
  word-break: break-all;
  font-weight: 600;
}

.page-index__parsing-records__label {
  display: inline-block;
  color: #717391;
  line-height: 20px;
}

.page-index__parsing-records__item {
  margin-top: 8px;
  padding: 8px;
  display: flex;
  border-radius: 4px;
  background: #e9ebf8;
  cursor: pointer;

  &:hover {
    background: rgba(233, 235, 248, 0.5)
  }
}

.page-index__parsing-records__address {
  color: $primary-font-color;
  line-height: 20px;
}

.page-index__parsing-records__tag {
  display: inline-block;
  margin-top: 4px;
  padding: 1px 4px;
  background: #FFFFFF;
  border-radius: 4px;
  border: 1px solid #E6E9F7;
  color: #2471FE;
}

.page-index__parsing-records__margin-right-8 {
  margin-right: 8px;
}

.page-index__parsing-records__width-24 {
  display: inline-block;
  min-width: 24px;
}

.page-index__submit {
  margin-top: 68px;
}
</style>
