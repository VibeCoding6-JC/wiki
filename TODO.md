# 🎯 Development TODO List

## Sprint 1: Core Infrastructure

### Authentication Enhancements
- [ ] Implement Reset Password functionality
  - Backend: `server/modules/authentication/`
  - Frontend: `client/components/login/`
- [ ] 3rd Party Authentication Setup
  - OAuth2 integration
  - SAML support
  - Social login (Google, GitHub, etc.)

### Editor Improvements
- [ ] Page Templates System
  - Create template management UI
  - Template selection on new page
- [ ] Insert Link Dialog
  - Internal page linking
  - External URL support
  - Anchor links

## Sprint 2: Content Features

### Page Enhancements
- [ ] Table of Contents (ToC)
  - Auto-generate from headings
  - Configurable depth
  - Floating/sticky option
- [ ] Page History
  - Version comparison (diff)
  - Restore previous versions
  - Author tracking

### Navigation
- [ ] Browse Mode
  - Directory-style navigation
  - Folder hierarchy view

## Sprint 3: Advanced Features

### Comments System
- [ ] Comment module implementation
  - Threaded comments
  - Markdown support
  - User mentions

### Analytics
- [ ] Page view tracking
  - View counts
  - Popular pages
  - User activity

## Technical Debt

- [ ] Update Vue.js to Vue 3
- [ ] Migrate to TypeScript
- [ ] Add comprehensive unit tests
- [ ] Improve error handling
- [ ] Performance optimization

## Notes

- Check upstream issues: https://github.com/requarks/wiki/issues
- Sync with upstream regularly
- Test on multiple databases (PostgreSQL, SQLite, MySQL)
