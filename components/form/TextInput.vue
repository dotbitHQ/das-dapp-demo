<template>
  <div class="text-input">
    <input
      v-bind="$attrs"
      :value="value"
      class="text-input__input"
      :class="{ 'text-input__input_error': !!errorMessages[0] }"
      :type="type"
      v-on="listeners"/>
    <div
      v-if="errorMessages[0]"
      class="text-input__error-messages">
      {{ errorMessages[0] }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'TextInput',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    errorMessages: {
      type: Array as PropType<string[]>,
      default: () => ([])
    }
  },
  computed: {
    listeners (): object {
      const _vm = this
      return {
        ...this.$listeners,
        input (event: Event) {
          _vm.$emit('input', (event.target as HTMLInputElement).value)
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'assets/variables';

.text-input {
  display: flex;
  flex-direction: column;
}

.text-input__input {
  height: 34px;
  padding: 11px 40px 11px 24px;
  border-radius: 12px;
  border: 1px solid $normal-color;
  background: $normal-color;
  color: $primary-font-color;
  caret-color: $link-font-color;
  outline: none;
  font-size: 14px;
  line-height: 20px;
  -webkit-appearance: none;

  &:hover {
    border: 1px solid $focus-color;
    background: $white;
    box-shadow: inset 0 0 0 4px rgba(45, 100, 246, 0.1);
  }

  &::placeholder {
    color: $assist-font-color;
    font-weight: 400;
  }
}

.text-input__input_error {
  border: 1px solid $error-color;
  background: $white;
  box-shadow: inset 0 0 0 4px rgba(223, 75, 70, 0.1);

  &:hover {
    border: 1px solid $error-color;
    box-shadow: inset 0 0 0 4px rgba(223, 75, 70, 0.1);
  }
}

.text-input__error-messages {
  margin-top: 4px;
  font-size: 12px;
  font-weight: 600;
  color: $error-font-color;
  line-height: 14px;
}
</style>
