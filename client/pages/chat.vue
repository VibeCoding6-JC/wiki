<template lang="pug">
  chat-container
</template>

<script>
import ChatContainer from '../components/chat/ChatContainer.vue'

export default {
  name: 'ChatPage',
  components: {
    ChatContainer
  },
  head() {
    return {
      title: this.$t('chat.title')
    }
  }
}
</script>
