/* global WIKI */

const _ = require('lodash')
const { v4: uuid } = require('uuid')

module.exports = {
  Query: {
    async chat() {
      return {}
    }
  },
  Mutation: {
    async chat() {
      return {}
    }
  },
  ChatQuery: {
    /**
     * Get chat status and configuration
     */
    async status(obj, args, context, info) {
      const chatConfig = WIKI.config.chat || {}
      return {
        isEnabled: chatConfig.enabled || false,
        provider: chatConfig.provider || 'none',
        welcomeMessage: _.get(chatConfig, 'settings.welcomeMessage', 'Hello! How can I help you?')
      }
    }
  },
  ChatMutation: {
    /**
     * Send a message to AI assistant
     */
    async sendMessage(obj, args, context, info) {
      try {
        const chatConfig = WIKI.config.chat || {}
        
        // Check if chat is enabled
        if (!chatConfig.enabled) {
          return {
            responseResult: {
              succeeded: false,
              errorCode: 1,
              slug: 'chat_disabled',
              message: 'Chat feature is not enabled'
            },
            message: null
          }
        }

        // Check if user is authenticated (requireLogin setting)
        if (chatConfig.settings?.requireLogin && context.req.user.id === 2) {
          return {
            responseResult: {
              succeeded: false,
              errorCode: 2,
              slug: 'auth_required',
              message: 'You must be logged in to use the chat feature'
            },
            message: null
          }
        }

        const { content, history = [] } = args

        // Search knowledge base for relevant content
        const knowledgeService = require('../modules/chat/knowledge.service')
        const relevantPages = await knowledgeService.searchRelevantContent(content)

        // Generate AI response
        const geminiService = require('../modules/chat/gemini.service')
        const aiResponse = await geminiService.generateResponse({
          userMessage: content,
          chatHistory: history,
          context: relevantPages
        })

        return {
          responseResult: {
            succeeded: true,
            errorCode: 0,
            slug: 'success',
            message: 'Message sent successfully'
          },
          message: {
            id: uuid(),
            role: 'ASSISTANT',
            content: aiResponse.text,
            references: aiResponse.references,
            createdAt: new Date()
          }
        }
      } catch (err) {
        WIKI.logger.error(`Chat Error: ${err.message}`)
        return {
          responseResult: {
            succeeded: false,
            errorCode: 500,
            slug: 'chat_error',
            message: err.message || 'An error occurred while processing your message'
          },
          message: null
        }
      }
    }
  }
}
