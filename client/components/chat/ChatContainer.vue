<template lang="pug">
  v-app.chat-page
    v-app-bar(app color="primary" dark)
      v-btn(icon @click="goBack")
        v-icon mdi-arrow-left
      v-toolbar-title {{ t('chat.title', 'Chat Assistant') }}
      v-spacer
      v-btn(icon @click="clearChat" :disabled="messages.length === 0")
        v-icon mdi-delete-outline

    v-main
      .chat-container
        .chat-messages(ref="messagesContainer")
          //- Welcome message
          .chat-welcome(v-if="messages.length === 0")
            v-icon.chat-welcome-icon(size="64" color="primary") mdi-robot-happy
            h2 {{ welcomeMessage }}
            p.chat-welcome-hint {{ t('chat.welcomeHint', 'Ask me anything about the knowledge base!') }}

          //- Messages
          chat-message(
            v-for="msg in messages"
            :key="msg.id"
            :message="msg"
          )

          //- Typing indicator
          .chat-typing(v-if="loading")
            v-progress-circular(indeterminate size="20" width="2" color="primary")
            span {{ t('chat.thinking', 'Thinking...') }}

        //- Input
        chat-input(
          :loading="loading"
          @send="sendMessage"
        )

    //- Error snackbar
    v-snackbar(v-model="showError" color="error" timeout="5000")
      | {{ errorMessage }}
      template(v-slot:action="{ attrs }")
        v-btn(text v-bind="attrs" @click="showError = false") {{ t('common.actions.dismiss', 'Dismiss') }}
</template>

<script>
import { v4 as uuid } from 'uuid'
import ChatMessage from './ChatMessage.vue'
import ChatInput from './ChatInput.vue'
import chatSendMutation from '../../graph/chat/chat-send.gql'
import chatStatusQuery from '../../graph/chat/chat-status.gql'

export default {
  name: 'ChatContainer',
  components: {
    ChatMessage,
    ChatInput
  },
  data() {
    return {
      messages: [],
      loading: false,
      welcomeMessage: 'Hello! How can I help you today?',
      showError: false,
      errorMessage: ''
    }
  },
  async mounted() {
    await this.fetchChatStatus()
    this.scrollToBottom()
  },
  methods: {
    t(key, fallback) {
      const translated = this.$t(key)
      return translated === key ? fallback : translated
    },
    async fetchChatStatus() {
      try {
        const resp = await this.$apollo.query({
          query: chatStatusQuery,
          fetchPolicy: 'network-only'
        })

        if (resp.data?.chat?.status) {
          const status = resp.data.chat.status
          if (status.welcomeMessage) {
            this.welcomeMessage = status.welcomeMessage
          }

          if (!status.isEnabled) {
            this.errorMessage = this.t('chat.disabled', 'Chat is currently disabled')
            this.showError = true
          }
        }
      } catch (err) {
        console.error('Failed to fetch chat status:', err)
      }
    },

    async sendMessage(content) {
      // Add user message
      const userMessage = {
        id: uuid(),
        role: 'USER',
        content: content,
        createdAt: new Date().toISOString()
      }
      this.messages.push(userMessage)
      this.scrollToBottom()

      // Prepare history for API (exclude current message)
      const history = this.messages.slice(0, -1).map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      this.loading = true

      try {
        const resp = await this.$apollo.mutate({
          mutation: chatSendMutation,
          variables: {
            content: content,
            history: history.slice(-10) // Send last 10 messages as context
          }
        })

        const result = resp.data?.chat?.sendMessage

        if (result?.responseResult?.succeeded && result.message) {
          this.messages.push(result.message)
        } else {
          this.errorMessage = result?.responseResult?.message || this.t('chat.error', 'An error occurred')
          this.showError = true
        }
      } catch (err) {
        console.error('Chat error:', err)
        this.errorMessage = err.message || this.t('chat.error', 'An error occurred')
        this.showError = true
      } finally {
        this.loading = false
        this.scrollToBottom()
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    },

    goBack() {
      this.$router.go(-1)
    },

    clearChat() {
      this.messages = []
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.chat-welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: rgba(0, 0, 0, 0.6);

  &-icon {
    margin-bottom: 16px;
    opacity: 0.8;
  }

  h2 {
    margin-bottom: 8px;
    font-weight: 500;
  }

  &-hint {
    font-size: 0.875rem;
    opacity: 0.7;
  }
}

.chat-typing {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: rgba(0, 0, 0, 0.5);

  span {
    margin-left: 8px;
    font-size: 0.875rem;
  }
}
</style>
