<template>
  <svg
    class="iconfont"
    :style="style"
    aria-hidden="true"
    v-on="$listeners">
    <use :xlink:href="'#icon-' + name" />
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Iconfont',
  props: {
    name: {
      type: String,
      default: '',
      required: true
    },
    color: {
      type: String,
      default: ''
    },
    size: {
      type: [Number, String],
      default: 24
    },
    rounded: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    style (): { [key: string]: string } {
      let style: { [key: string]: string } = {
        height: `${this.size}px`,
        width: `${this.size}px`
      }

      if (this.color) {
        style.color = this.color
      }

      if (this.rounded && this.size) {
        style = {
          ...style,
          borderRadius: `${this.size}px`
        }
      }
      return style
    }
  }
})
</script>

<style lang="scss" scoped>
.iconfont {
  display: inline-block;
  vertical-align: sub;
  fill: currentColor;
  outline: unset;
  font-size: 1px;
}
</style>
