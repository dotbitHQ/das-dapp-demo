<template>
  <div v-if="showing" class="dialog">
    <div class="dialog__container">
      <ContentHeader
        :title="title"
        :closeButton="closeButton"
        @close="onClose"/>
      <div
        v-if="$slots.default"
        class="dialog__slot-content">
        <slot name="default"/>
      </div>
      <div
        v-else
        class="dialog__content">
        {{ message }}
      </div>
      <div
        v-if="$slots.action"
        class="dialog__action">
        <slot name="action"/>
      </div>
      <div
        v-else
        class="dialog__action">
        <Button
          success
          block
          @click="onClose(false)">
          {{ actionButtonText || $t('OK') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ContentHeader from '~/components/ContentHeader.vue'
import Button from '~/components/Button.vue'

export default Vue.extend({
  name: 'Dialog',
  components: {
    ContentHeader,
    Button
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
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    actionButtonText: {
      type: String
    },
    closeButton: {
      type: Boolean,
      default: false
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

.dialog {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: rgba(27, 29, 33, 0.7);
  z-index: 30;
}

.dialog__container {
  width: 92%;
  max-width: 490px;
  max-height: 90%;
  align-self: center;
  border-radius: 24px;
  background: $white;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0 !important
  }
}

.dialog__content {
  padding: 0 24px;
  font-size: 14px;
  color: $primary-font-color;
  line-height: 20px;
  word-break: break-word;
}

.dialog__slot-content {
  padding: 0 24px;
}

.dialog__action {
  padding: 24px;
}
</style>
