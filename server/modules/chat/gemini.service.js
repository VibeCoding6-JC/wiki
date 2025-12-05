/* global WIKI */

const { GoogleGenerativeAI } = require('@google/generative-ai')

/**
 * Gemini AI Service for Wiki.js Chat
 */
class GeminiService {
  constructor() {
    this.client = null
    this.model = null
  }

  /**
   * Initialize the Gemini client
   */
  init() {
    const config = WIKI.config.chat?.gemini || {}
    
    if (!config.apiKey) {
      throw new Error('Gemini API key is not configured')
    }

    this.client = new GoogleGenerativeAI(config.apiKey)
    this.model = this.client.getGenerativeModel({ 
      model: config.model || 'gemini-2.0-flash-exp'
    })
    
    this.maxTokens = config.maxTokens || 2048
    this.temperature = config.temperature || 0.7
  }

  /**
   * Generate a response from the AI
   * @param {Object} options - Generation options
   * @param {string} options.userMessage - The user's message
   * @param {Array} options.chatHistory - Previous chat messages
   * @param {Array} options.context - Relevant wiki pages content
   * @returns {Object} AI response with text and references
   */
  async generateResponse({ userMessage, chatHistory = [], context = [] }) {
    if (!this.client) {
      this.init()
    }

    // Build context from wiki pages
    const contextText = this.buildContextText(context)
    
    // Build the system prompt
    const systemPrompt = this.buildSystemPrompt(contextText)
    
    // Build chat history for the model
    const formattedHistory = this.formatChatHistory(chatHistory)
    
    try {
      // Start a chat session
      const chat = this.model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }]
          },
          {
            role: 'model',
            parts: [{ text: 'Understood. I will answer questions based on the provided Wiki.js knowledge base content. I will be helpful, accurate, and reference specific pages when applicable.' }]
          },
          ...formattedHistory
        ],
        generationConfig: {
          maxOutputTokens: this.maxTokens,
          temperature: this.temperature
        }
      })

      // Send the user message
      const result = await chat.sendMessage(userMessage)
      const response = await result.response
      const text = response.text()

      // Extract references from context
      const references = context.map(page => ({
        pageId: page.id,
        path: page.path,
        title: page.title,
        locale: page.locale || 'en'
      }))

      return {
        text,
        references: references.slice(0, 5) // Limit to 5 references
      }
    } catch (error) {
      WIKI.logger.error(`Gemini API Error: ${error.message}`)
      throw new Error(`Failed to generate AI response: ${error.message}`)
    }
  }

  /**
   * Build context text from wiki pages
   * @param {Array} pages - Relevant wiki pages
   * @returns {string} Formatted context text
   */
  buildContextText(pages) {
    if (!pages || pages.length === 0) {
      return 'No relevant documentation found in the knowledge base.'
    }

    return pages.map(page => {
      return `
--- Page: ${page.title} (${page.path}) ---
${page.content || page.description || 'No content available'}
---`
    }).join('\n\n')
  }

  /**
   * Build the system prompt
   * @param {string} contextText - The context from wiki pages
   * @returns {string} System prompt
   */
  buildSystemPrompt(contextText) {
    return `You are a helpful AI assistant for a Wiki.js knowledge base.
Your role is to answer questions based on the documentation provided below.

IMPORTANT GUIDELINES:
1. Answer questions based ONLY on the provided context from the wiki pages
2. If the information is not in the provided context, politely say you don't have that information in the knowledge base
3. Be concise and helpful
4. Reference specific pages when applicable (mention the page title or path)
5. Use markdown formatting for better readability
6. If asked about something outside the wiki content, suggest browsing the wiki directly
7. Always be polite and professional

KNOWLEDGE BASE CONTENT:
${contextText}

Remember: Only use information from the above content. Do not make up information.`
  }

  /**
   * Format chat history for Gemini
   * @param {Array} history - Chat history
   * @returns {Array} Formatted history
   */
  formatChatHistory(history) {
    return history.map(msg => ({
      role: msg.role === 'USER' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))
  }
}

module.exports = new GeminiService()
