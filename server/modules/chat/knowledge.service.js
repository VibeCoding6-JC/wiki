/* global WIKI */

const _ = require('lodash')

/**
 * Knowledge Base Search Service for Wiki.js Chat
 * Searches wiki pages to find relevant content for AI context
 */
class KnowledgeService {
  /**
   * Search for relevant content based on user query
   * @param {string} query - The user's search query
   * @param {Object} options - Search options
   * @param {number} options.limit - Maximum number of results
   * @param {string} options.locale - Locale to search in
   * @returns {Array} Relevant wiki pages with content
   */
  async searchRelevantContent(query, options = {}) {
    const { limit = 5, locale = null } = options

    try {
      // Extract keywords from query for better search
      const keywords = this.extractKeywords(query)

      // Search pages using the database
      const results = await this.searchPages(keywords, { limit, locale })

      // Fetch full content for relevant pages
      const pagesWithContent = await this.fetchPageContent(results)

      return pagesWithContent
    } catch (error) {
      WIKI.logger.error(`Knowledge Search Error: ${error.message}`)
      return []
    }
  }

  /**
   * Extract keywords from a query
   * @param {string} query - The search query
   * @returns {Array} Keywords
   */
  extractKeywords(query) {
    // Remove common stop words and extract meaningful keywords
    const stopWords = ['a', 'an', 'the', 'is', 'are', 'was', 'were', 'what', 'how', 'why', 'when', 'where', 'who', 'which', 'do', 'does', 'did', 'can', 'could', 'would', 'should', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'and', 'or', 'but', 'not', 'be', 'have', 'has', 'had', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'saya', 'apa', 'bagaimana', 'mengapa', 'kapan', 'dimana', 'siapa', 'yang', 'dan', 'atau', 'untuk', 'dengan', 'pada', 'dari', 'ke', 'di', 'ini', 'itu']

    const words = query.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word))

    return [...new Set(words)] // Remove duplicates
  }

  /**
   * Search pages in the database
   * @param {Array} keywords - Keywords to search for
   * @param {Object} options - Search options
   * @returns {Array} Search results
   */
  async searchPages(keywords, options = {}) {
    const { limit = 5, locale = null } = options

    if (keywords.length === 0) {
      return []
    }

    const searchQuery = keywords.join(' ')

    try {
      let query = WIKI.models.pages.query()
        .select('pages.id', 'pages.path', 'pages.title', 'pages.description', 'pages.localeCode as locale', 'pages.content')
        .where('isPublished', true)

      // Add locale filter if specified
      if (locale) {
        query = query.andWhere('localeCode', locale)
      }

      // Search in title, description, path, and content
      query = query.andWhere(builder => {
        keywords.forEach((keyword, index) => {
          const method = index === 0 ? 'where' : 'orWhere'

          if (WIKI.config.db.type === 'postgres') {
            builder[method]('title', 'ILIKE', `%${keyword}%`)
            builder.orWhere('description', 'ILIKE', `%${keyword}%`)
            builder.orWhere('path', 'ILIKE', `%${keyword}%`)
            builder.orWhere('content', 'ILIKE', `%${keyword}%`)
          } else {
            builder[method]('title', 'LIKE', `%${keyword}%`)
            builder.orWhere('description', 'LIKE', `%${keyword}%`)
            builder.orWhere('path', 'LIKE', `%${keyword}%`)
            builder.orWhere('content', 'LIKE', `%${keyword}%`)
          }
        })
      })

      const results = await query.limit(limit * 2) // Get more results for ranking

      // Rank results by relevance
      const rankedResults = this.rankResults(results, keywords)

      return rankedResults.slice(0, limit)
    } catch (error) {
      WIKI.logger.error(`Page Search Error: ${error.message}`)
      return []
    }
  }

  /**
   * Rank search results by relevance
   * @param {Array} results - Search results
   * @param {Array} keywords - Search keywords
   * @returns {Array} Ranked results
   */
  rankResults(results, keywords) {
    return results.map(page => {
      let score = 0
      const lowerTitle = (page.title || '').toLowerCase()
      const lowerDescription = (page.description || '').toLowerCase()
      const lowerPath = (page.path || '').toLowerCase()
      const lowerContent = (page.content || '').toLowerCase()

      keywords.forEach(keyword => {
        // Title matches are most important
        if (lowerTitle.includes(keyword)) score += 10
        // Path matches are also important
        if (lowerPath.includes(keyword)) score += 5
        // Description matches
        if (lowerDescription.includes(keyword)) score += 3
        // Content matches
        if (lowerContent.includes(keyword)) score += 1
      })

      return { ...page, relevanceScore: score }
    })
    .filter(page => page.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
  }

  /**
   * Fetch and process page content
   * @param {Array} pages - Pages to process
   * @returns {Array} Pages with processed content
   */
  async fetchPageContent(pages) {
    return pages.map(page => {
      // Truncate content to avoid token limits
      let content = page.content || page.description || ''

      // Remove HTML tags if present
      content = content.replace(/<[^>]*>/g, ' ')

      // Remove excessive whitespace
      content = content.replace(/\s+/g, ' ').trim()

      // Truncate to reasonable length (about 1000 chars per page)
      if (content.length > 1500) {
        content = content.substring(0, 1500) + '...'
      }

      return {
        id: page.id,
        path: page.path,
        title: page.title,
        description: page.description,
        locale: page.locale,
        content: content
      }
    })
  }
}

module.exports = new KnowledgeService()
