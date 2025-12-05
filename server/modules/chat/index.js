/**
 * Chat Module for Wiki.js
 * Provides AI-powered chat functionality using knowledge base content
 */

const geminiService = require('./gemini.service')
const knowledgeService = require('./knowledge.service')

module.exports = {
  geminiService,
  knowledgeService
}
