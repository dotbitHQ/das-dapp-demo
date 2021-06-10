<template>
  <span v-if="showing" class="toast">
    {{ message }}
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
import { TOAST_DURATION_TIME } from '~/constant'

export default Vue.extend({
  name: 'Toast',
  model: {
    prop: 'showing',
    event: 'close'
  },
  props: {
    showing: {
      type: Boolean,
      required: false
    },
    duration: {
      type: Number,
      default: TOAST_DURATION_TIME
    },
    message: {
      type: String,
      default: ''
    }
  },
  mounted () {
    window.setTimeout(() => {
      this.onClose()
    }, this.duration)
  },
  methods: {
    onClose () {
      this.$emit('close', false)
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'assets/variables';

.toast {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  padding: 16px;
  width: max-content;
  height: max-content;
  min-width: 120px;
  border-radius: 8px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: $white;
  line-height: 22px;
  box-shadow: $container-outer-box-shadow;
  background: $assist-color;
  z-index: 30;
}
</style>
