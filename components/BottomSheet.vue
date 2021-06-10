<template>
  <transition name="fade">
    <div
      v-show="showing"
      class="bottom-sheet"
    >
      <transition name="container">
        <div
          v-show="showing"
          class="bottom-sheet__container"
        >
          <ContentHeader
            :title="title"
            :closeButton="closeButton"
            @close="onClose"
          />
          <div class="bottom-sheet__content">
            <slot />
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import ContentHeader from '~/components/ContentHeader.vue'

export default Vue.extend({
  name: 'BottomSheet',
  components: {
    ContentHeader
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
    title: {
      type: String,
      required: true
    },
    closeButton: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onClose (value: boolean) {
      this.$emit('close', value)
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'assets/variables';

.bottom-sheet {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: rgba(27, 29, 33, 0.7);
  z-index: 20;
}

.bottom-sheet__container {
  position: absolute;
  width: 100%;
  max-width: $pc-layout-container-width;
  max-height: 90%;
  align-self: flex-end;
  border-radius: 24px 24px 0 0;
  background: $white;
  overflow: hidden;
}

.bottom-sheet__content {
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.fade-enter-active {
  animation: show-bg 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.fade-leave-active {
  animation: hide-bg 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.container-enter-active {
  animation: slide-top 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.container-leave-active {
  animation: slide-bottom 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

@keyframes show-bg {
  0% {
    background: rgba(27, 29, 33, 0);
  }
  100% {
    background: rgba(27, 29, 33, 0.7);
  }
}

@keyframes hide-bg {
  0% {
    background: rgba(27, 29, 33, 0.7);
  }
  100% {
    background: rgba(27, 29, 33, 0);
  }
}

@keyframes slide-top {
  0% {
    bottom: -100%;
  }
  100% {
    bottom: 0;
  }
}

@keyframes slide-bottom {
  0% {
    bottom: 0;
  }
  100% {
    bottom: -100%;
  }
}
</style>
