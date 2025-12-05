<template lang="pug">
  .chat-message(:class="messageClass")
    .chat-message-avatar
      v-avatar(:color="avatarColor" size="36")
        v-icon(dark) {{ avatarIcon }}
    .chat-message-content
      .chat-message-header
        span.chat-message-role {{ roleLabel }}
        span.chat-message-time {{ formattedTime }}
      .chat-message-text(v-html="formattedContent")
      .chat-message-references(v-if="message.references && message.references.length > 0")
        v-chip.mr-1.mt-1(
          v-for="ref in message.references"
          :key="ref.pageId"
          small
          outlined
          color="primary"
          @click="goToPage(ref)"
        )
          v-icon(left small) mdi-file-document
          | {{ ref.title }}
</template>

<script>
import marked from 'marked'
import DOMPurify from 'dompurify'

export default {
  name: 'ChatMessage',
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  computed: {
    messageClass() {
      return {
        'chat-message-user': this.message.role === 'USER',
        'chat-message-assistant': this.message.role === 'ASSISTANT',
        'chat-message-system': this.message.role === 'SYSTEM'
      }
    },
    avatarColor() {
      switch (this.message.role) {
        case 'USER': return 'blue'
        case 'ASSISTANT': return 'green'
        default: return 'grey'
      }
    },
    avatarIcon() {
      switch (this.message.role) {
        case 'USER': return 'mdi-account'
        case 'ASSISTANT': return 'mdi-robot'
        default: return 'mdi-information'
      }
    },
    roleLabel() {
      switch (this.message.role) {
        case 'USER': return this.t('chat.you', 'You')
        case 'ASSISTANT': return this.t('chat.assistant', 'Assistant')
        default: return 'System'
      }
    },
    formattedTime() {
      if (!this.message.createdAt) return ''
      const date = new Date(this.message.createdAt)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    formattedContent() {
      // Parse markdown and sanitize HTML
      try {
        const rawHtml = marked.parse(this.message.content || '')
        return DOMPurify.sanitize(rawHtml)
      } catch (e) {
        return this.message.content || ''
      }
    }
  },
  methods: {
    t(key, fallback) {
      const translated = this.$t(key)
      return translated === key ? fallback : translated
    },
    goToPage(ref) {
      this.$router.push(`/${ref.locale}/${ref.path}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-message {
  display: flex;
  padding: 12px 16px;
  margin: 8px 0;

  &-user {
    background-color: rgba(33, 150, 243, 0.1);
    border-radius: 12px 12px 0 12px;
    margin-left: 48px;
  }

  &-assistant {
    background-color: rgba(76, 175, 80, 0.1);
    border-radius: 12px 12px 12px 0;
    margin-right: 48px;
  }

  &-avatar {
    flex-shrink: 0;
    margin-right: 12px;
  }

  &-content {
    flex: 1;
    min-width: 0;
  }

  &-header {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
  }

  &-role {
    font-weight: 600;
    font-size: 0.875rem;
  }

  &-time {
    margin-left: 8px;
    font-size: 0.75rem;
    color: rgba(0, 0, 0, 0.5);
  }

  &-text {
    font-size: 0.9375rem;
    line-height: 1.5;
    word-wrap: break-word;

    ::v-deep {
      p {
        margin: 0 0 8px 0;
        &:last-child {
          margin-bottom: 0;
        }
      }

      code {
        background-color: rgba(0, 0, 0, 0.05);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.875em;
      }

      pre {
        background-color: rgba(0, 0, 0, 0.05);
        padding: 12px;
        border-radius: 8px;
        overflow-x: auto;

        code {
          background: none;
          padding: 0;
        }
      }

      ul, ol {
        margin: 8px 0;
        padding-left: 20px;
      }
    }
  }

  &-references {
    margin-top: 8px;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
