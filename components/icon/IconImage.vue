<template>
  <span
    v-if="mode === MODE.firstChar"
    class="icon-image icon-image__text"
    :style="style"
    v-on="$listeners">
    {{ firstChar.text }}
  </span>
  <img
    v-else
    class="icon-image"
    :style="style"
    :src="imgUrl"
    draggable="false"
    v-on="$listeners"/>
</template>

<script lang="ts">
import Vue from 'vue'

const MODE = {
  img: 'img',
  firstChar: 'firstChar'
}

export default Vue.extend({
  name: 'IconImage',
  props: {
    url: {
      type: String,
      default: '',
      required: true
    },
    alt: {
      type: String,
      default: '',
      required: true
    },
    size: {
      type: Number,
      default: 24
    },
    rounded: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      MODE,
      imgUrl: '',
      mode: MODE.firstChar
    }
  },
  computed: {
    style (): { [key: string]: string } {
      let style: { [key: string]: string } = {
        height: `${this.size}px`,
        width: `${this.size}px`
      }

      if (this.mode === MODE.firstChar) {
        style = {
          ...style,
          fontSize: `${this.size * 0.5}px`,
          lineHeight: `${this.size}px`
        }

        if (this.firstChar.text) {
          style = {
            ...style,
            background: this.firstChar.color
          }
        }
      }

      if (this.rounded && this.size) {
        style = {
          ...style,
          borderRadius: `${this.size}px`
        }
      }
      return style
    },
    firstChar (): { color: string, text: string } {
      const colorMap: { [key: string]: string } = {
        A: '#AC7549',
        B: '#679781',
        C: '#AB68B6',
        D: '#9B9FBA',
        E: '#6A7BDE',
        F: '#1B2C89',
        G: '#4C4CAC',
        H: '#C74331',
        I: '#D28F48',
        J: '#F7D09A',
        K: '#1ABB9C',
        L: '#9D8562',
        M: '#706460',
        N: '#654E3A',
        O: '#9E9E9E',
        P: '#795548',
        Q: '#FE5821',
        R: '#FE9800',
        S: '#E3443A',
        T: '#F6946E',
        U: '#679781',
        V: '#4CAE51',
        W: '#009688',
        X: '#07BBD3',
        Y: '#08A9F3',
        Z: '#2196F2'
      }
      const _firstChar: string = this.alt && this.alt[0]
      if (_firstChar && colorMap[_firstChar.toUpperCase()]) {
        return {
          text: _firstChar,
          color: colorMap[_firstChar.toUpperCase()]
        }
      }
      else {
        return {
          text: _firstChar || '',
          color: '#3F52B4'
        }
      }
    }
  },
  watch: {
    url () {
      this.init()
    },
    alt () {
      this.init()
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      const img = new Image()
      img.src = this.url

      img.onload = () => {
        this.mode = MODE.img
        this.imgUrl = this.url
      }

      img.onerror = () => {
        this.mode = MODE.firstChar
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'assets/variables';

.icon-image {
  display: inline-block;
}

.icon-image__text {
  border-radius: 50%;
  font-weight: 600;
  text-transform: uppercase;
  text-align: center;
  color: $white;
}
</style>
