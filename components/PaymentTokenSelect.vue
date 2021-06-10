<template>
  <div class="payment-token-select">
    <div class="payment-token-select__input__container">
      <input
        ref="input"
        v-bind="$attrs"
        :value="selectOption.symbol"
        class="payment-token-select__input"
        type="text"
        readonly="readonly"
        v-on="$listeners"
        @focus="onFocus"
      >
      <Iconfont
        class="payment-token-select__input__arrow-down"
        name="arrow-down"
        color="#11142D"
        @click="onFocus"
      />
    </div>
    <BottomSheet
      v-model="optionsShowing"
      :title="$t('Payment method')"
    >
      <ul
        class="payment-token-select__options"
      >
        <li
          v-for="(option, index) in showOptions"
          :key="index"
          class="payment-token-select__options__item"
          @click="onSelect(option)"
        >
          <span class="payment-token-select__options__logo">
            <Iconfont
              :name="option.icon"
              :alt="option.symbol"
              :size="30"
            />
          </span>
          <span class="payment-token-select__options__info">
            <span class="payment-token-select__options__symbol">{{ option.symbol }}</span>
            <span class="payment-token-select__options__name">{{ option.name }}</span>
          </span>
        </li>
        <li
          v-for="(option, index) in comingSoonOptions"
          :key="index + 'comingSoon'"
          class="payment-token-select__options__item payment-token-select__options__item_coming-soon"
          @click="comingSoon"
        >
          <span class="payment-token-select__options__logo">
            <Iconfont
              :name="option.icon"
              :alt="option.symbol"
              :size="30"
            />
          </span>
          <span class="payment-token-select__options__info">
            <span class="payment-token-select__options__symbol">
              {{ option.symbol }}
              <span
                v-if="option.tag"
                class="payment-token-select__options__tag"
              >
                {{ '-' + option.tag }}
              </span>
            </span>
            <span
              v-if="option.name"
              class="payment-token-select__options__name"
            >{{ option.name }}</span>
          </span>
        </li>
      </ul>
    </BottomSheet>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import { BTC, CHAIN_ID, CKB, IMainChain, LOCK_SCRIPT_TYPE, TRON } from '~/constant/chain'
import BottomSheet from '~/components/BottomSheet.vue'

export default Vue.extend({
  name: 'PaymentTokenSelect',
  components: {
    Iconfont,
    BottomSheet
  },
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: Object as PropType<IMainChain>,
      default: () => ({} as IMainChain),
      required: true
    },
    options: {
      type: Array as PropType<IMainChain[]>,
      default: () => ([]),
      required: true
    },
    currentChain: {
      type: Number as PropType<CHAIN_ID>,
      required: true
    }
  },
  data () {
    return {
      optionsShowing: false,
      selectOption: {
        symbol: ''
      } as IMainChain,
      comingSoonOptions: [{
        ...BTC
      }, {
        name: 'Tether',
        symbol: 'USDT',
        chainId: CHAIN_ID.eth,
        decimals: 6,
        icon: 'tether',
        tokenId: 'eth_usdt',
        lockScriptType: LOCK_SCRIPT_TYPE.eth,
        explorerAddress: '',
        tag: 'ERC20'
      }, {
        ...CKB
      }, {
        ...TRON
      }] as IMainChain[]
    }
  },
  computed: {
    showOptions (): IMainChain[] {
      return this.options.filter((option: IMainChain) => {
        return option.chainId === this.currentChain
      })
    }
  },
  watch: {
    showOptions () {
      this.defaultSelect()
    }
  },
  mounted () {
    this.defaultSelect()
  },
  methods: {
    onSelect (option: IMainChain) {
      this.selectOption = option
      this.$emit('input', option)
      this.$emit('blur')
      this.optionsShowing = false
    },
    comingSoon () {
      this.$toast((this.$t('即将支持') as string))
    },
    onFocus () {
      this.optionsShowing = true
      ;(this.$refs.input as HTMLInputElement).focus()
    },
    defaultSelect () {
      if (this.value.tokenId) {
        const _option = this.showOptions.find((option: IMainChain) => {
          return this.value.tokenId === option.tokenId
        })
        if (_option) {
          this.selectOption = _option
        }
        else if (this.showOptions.length > 0) {
          this.selectOption = this.showOptions[0]
          this.$emit('input', this.showOptions[0])
          this.$emit('blur')
        }
      }
      else if (this.showOptions.length > 0) {
        this.selectOption = this.showOptions[0]
        this.$emit('input', this.showOptions[0])
        this.$emit('blur')
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'assets/variables';

.payment-token-select {
  position: relative;
  cursor: pointer;
}

.payment-token-select__input__container {
  position: relative;
  display: flex;
  align-items: center;
}

.payment-token-select__input {
  width: 44px;
  padding: 0 24px 0 8px;
  border-radius: 8px;
  caret-color: $link-font-color;
  border: 0;
  outline: none;
  font-size: 18px;
  font-weight: 600;
  -webkit-appearance: none;
  cursor: pointer;
}

.payment-token-select__input__arrow-down {
  position: absolute;
  right: 0;
}

.payment-token-select__options {
  height: 440px;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0 !important
  }
}

.payment-token-select__options__item {
  display: flex;
  margin-top: 10px;
  padding: 9px 8px;
  height: 30px;
  border-radius: 8px;
  line-height: 30px;
  background: $white;
  border: $container-border;
  cursor: pointer;

  &:hover {
    background: #F6F7F9;
  }
}

.payment-token-select__options__item_coming-soon {
  filter: grayscale(100%);
  cursor: no-drop;

  &:hover {
    background: $white;
  }
}

.payment-token-select__options__logo {
  margin-right: 12px;
}

.payment-token-select__options__info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.payment-token-select__options__symbol {
  display: flex;
  line-height: 17px;
  font-weight: 600;
}

.payment-token-select__options__tag {
  color: #B2B3BD;
}

.payment-token-select__options__name {
  font-size: 12px;
  color: $third-font-color;
  line-height: 15px;
  font-weight: 600;
}
</style>
