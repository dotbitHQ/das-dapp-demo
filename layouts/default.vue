<template>
  <div
    :class="{
      'layout-default': !isMobile
    }"
  >
    <div
      :class="{
        'layout-default__container': !isMobile,
        'layout-default__container_mobile': isMobile
      }"
      :style="{ minHeight: isMobile && minHeight }"
    >
      <Nuxt />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { isMobile } from '~/modules/tools'

export default Vue.extend({
  name: 'LayoutEmpty',
  components: {
  },
  computed: {
    isMobile,
    minHeight () {
      return `${window.innerHeight}px`
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'assets/variables';

.layout-default {
  padding-top: 1px;
  min-height: 100vh;
  background: $background;
}

.layout-default__container {
  display: flex;
  margin: 24px auto 0 auto;
  width: $pc-layout-container-width;
  min-height: $pc-layout-container-min-height;
  background: $white;
  box-shadow: $pc-layout-container-box-shadow;
  border-radius: 16px;
  border: $container-border;
  overflow: hidden;
}

.layout-default__container_mobile {
  display: flex;
  margin-bottom: constant(safe-area-inset-bottom);
  margin-bottom: env(safe-area-inset-bottom);
}
</style>
