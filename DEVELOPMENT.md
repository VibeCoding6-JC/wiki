# Wiki.js Development Guide

## 📋 Overview

This is a forked repository of [Wiki.js](https://github.com/requarks/wiki) - a modern, lightweight and powerful wiki app built on Node.js, Git and Markdown.

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18.17.1 (check `.nvmrc`)
- **Yarn**: Latest version
- **Database**: PostgreSQL, MySQL, MariaDB, MS SQL Server, or SQLite

### Installation

```bash
# Clone the repository
git clone https://github.com/VibeCoding6-JC/wiki.git
cd wiki

# Install dependencies
yarn install

# Copy configuration file
cp config.sample.yml config.yml

# Start development server
yarn dev
```

## 🏗️ Project Structure

```
wiki/
├── client/              # Frontend (Vue.js)
│   ├── components/      # Vue components
│   ├── graph/           # GraphQL queries
│   ├── scss/            # Stylesheets
│   ├── store/           # Vuex store
│   └── themes/          # Theme files
├── server/              # Backend (Node.js/Express)
│   ├── app/             # Application modules
│   ├── controllers/     # Route controllers
│   ├── core/            # Core functionality
│   ├── db/              # Database migrations/seeds
│   ├── graph/           # GraphQL resolvers
│   ├── models/          # Data models
│   ├── modules/         # Feature modules
│   └── views/           # Pug templates
├── dev/                 # Development utilities
└── patches/             # Package patches
```

## 📦 Tech Stack

### Frontend
- **Vue.js 2** - Progressive JavaScript Framework
- **Vuetify** - Material Design Component Framework
- **Apollo Client** - GraphQL Client
- **Monaco Editor** - Code Editor (for Markdown)

### Backend
- **Express.js** - Web Framework
- **Apollo Server** - GraphQL Server
- **Knex.js** - SQL Query Builder
- **Objection.js** - ORM

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server with hot reload |
| `yarn build` | Build for production |
| `yarn start` | Start production server |
| `yarn test` | Run tests (ESLint, Pug-lint, Jest) |

## 🎯 Feature Development Priorities

Based on the [v3 Feature Parity Checklist](https://github.com/requarks/wiki/issues/6844):

### High Priority (Not Implemented)

#### Authentication
- [ ] 3rd party login (OAuth, SAML, etc.)
- [ ] Reset Password functionality

#### Editors
- [ ] AsciiDoc Editor
- [ ] Page Templates
- [ ] Insert Link/Code Block/Table dialogs
- [ ] Draw.io integration
- [ ] Tabsets feature

#### Pages
- [ ] Page History & Version Comparison
- [ ] Table of Contents
- [ ] Multi-locale support
- [ ] Print View
- [ ] SSR for SEO

#### Modules
- [ ] Analytics
- [ ] Comments system

### Medium Priority (Partial)

- [ ] WYSIWYG Editor improvements
- [ ] External storage modules
- [ ] Search autocomplete (with privacy)

## 🔀 Branch Strategy

- `main` - Stable, production-ready code
- `dev/enhancements` - Active development
- `feat/*` - Feature branches
- `fix/*` - Bug fixes
- `hotfix/*` - Critical fixes

## 📝 Contribution Guidelines

1. Create a feature branch from `dev/enhancements`
2. Make your changes with clear commit messages
3. Test thoroughly
4. Create a Pull Request

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 🔗 Useful Links

- [Official Documentation](https://docs.requarks.io/)
- [Upstream Repository](https://github.com/requarks/wiki)
- [API Documentation](https://docs.requarks.io/dev/api)
- [Discord Community](https://discord.gg/rcxt9QS2jd)

## 📄 License

This project is licensed under the AGPL-3.0 License.
