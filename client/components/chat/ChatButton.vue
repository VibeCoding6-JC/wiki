<template lang="pug">
  v-btn.chat-fab(
    color="primary"
    fab
    large
    fixed
    bottom
    right
    @click="openChat"
    title="Open Chat"
  )
    v-icon mdi-chat
</template>

<script>
export default {
  name: 'ChatButton',
  methods: {
    openChat() {
      this.$router.push('/chat')
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;

  &:hover {
    transform: scale(1.1);
    transition: transform 0.2s ease;
  }
}
</style>
