<template lang="pug">
  .chat-input
    v-textarea(
      v-model="message"
      :placeholder="t('chat.inputPlaceholder', 'Type your message...')"
      outlined
      auto-grow
      rows="1"
      max-rows="5"
      hide-details
      @keydown.enter.exact.prevent="sendMessage"
      @keydown.enter.shift.exact="newline"
      :disabled="loading"
    )
    v-btn.chat-send-btn(
      color="primary"
      fab
      small
      :loading="loading"
      :disabled="!canSend"
      @click="sendMessage"
    )
      v-icon mdi-send
</template>

<script>
export default {
  name: 'ChatInput',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      message: ''
    }
  },
  computed: {
    canSend() {
      return this.message.trim().length > 0 && !this.loading
    }
  },
  methods: {
    t(key, fallback) {
      const translated = this.$t(key)
      return translated === key ? fallback : translated
    },
    sendMessage() {
      if (!this.canSend) return
      this.$emit('send', this.message.trim())
      this.message = ''
    },
    newline() {
      // Allow shift+enter to create new line
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-input {
  display: flex;
  align-items: flex-end;
  padding: 12px 16px;
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.1);

  .v-textarea {
    flex: 1;
    margin-right: 12px;
  }

  .chat-send-btn {
    flex-shrink: 0;
    margin-bottom: 4px;
  }
}
</style>
