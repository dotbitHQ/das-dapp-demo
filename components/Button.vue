<template>
  <button
    v-bind="$attrs"
    class="button"
    :class="{
      button_block: block,
      button_normal: normal,
      button_primary: primary,
      button_error: error,
      button_success: success
    }"
    :disabled="$attrs.disabled || loading"
    v-on="$listeners">
    <span
      v-if="loading"
      class="button__loading-icon">
      <Iconfont name="loading" color="#D5D5D5" />
    </span>
    <nuxt-link
      v-if="to"
      class="button__link"
      :to="to">
      <slot/>
    </nuxt-link>
    <slot v-else/>
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
import Iconfont from '~/components/icon/Iconfont.vue'

export default Vue.extend({
  name: 'Button',
  components: {
    Iconfont
  },
  inheritAttrs: false,
  props: {
    block: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    primary: {
      type: Boolean,
      default: false
    },
    normal: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    success: {
      type: Boolean,
      default: false
    },
    to: {
      type: String,
      default: ''
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'assets/variables';

.button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
  color: $white;
  border-radius: 16px;
  outline: none;
  cursor: pointer;
  border: none;
  box-shadow: none;

  &:disabled {
    cursor: default;
    background: $disabled-color !important;
  }
}

.button__link {
  color: unset;
}

.button_block {
  width: 100%;
}

.button_normal {
  color: $primary-font-color;
  background: $white;

  &:hover {
    background: $normal-hover-color;
  }

  &:disabled {
    color: rgba(17, 20, 45, 0.3);
    background: $white !important;
  }
}

.button_primary {
  background: $primary-color;

  &:hover {
    background: $primary-hover-color;
  }
}

.button_success {
  background: $success-color;

  &:hover {
    background: $success-hover-color;
  }
}

.button_error {
  background: $error-color;

  &:hover {
    background: $error-hover-color;
  }
}

.button__loading-icon {
  margin-right: 8px;
  svg {
    animation: rotate360DegAnimation 0.9s linear infinite;
  }
}
</style>
