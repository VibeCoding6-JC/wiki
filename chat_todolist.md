# 🗨️ Chat Feature Development Plan

## Fitur: AI Chat untuk Knowledge Base Wiki.js

### 📋 Deskripsi Fitur
Menambahkan tombol chat di halaman welcome yang ketika ditekan akan membuka halaman chatting. Fitur chat ini memungkinkan pengguna untuk bertanya dan mencari informasi dari seluruh knowledge base yang ada di Wiki.js menggunakan AI.

---

## 🎯 Tujuan
1. Memudahkan pengguna menemukan informasi tanpa harus browsing manual
2. Menyediakan interface chat yang intuitif
3. Mengintegrasikan AI untuk menjawab pertanyaan berdasarkan konten wiki
4. Meningkatkan user experience dan engagement

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Vue.js)                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐         ┌─────────────────────────────────┐   │
│  │  Welcome Page   │         │       Chat Page                 │   │
│  │                 │         │  ┌─────────────────────────┐    │   │
│  │  [💬 Chat]────────────────│─▶│   Chat Interface        │    │   │
│  │                 │         │  │  - Message List         │    │   │
│  └─────────────────┘         │  │  - Input Box            │    │   │
│                              │  │  - Send Button          │    │   │
│                              │  └─────────────────────────┘    │   │
│                              └─────────────────────────────────┘   │
│                                           │                         │
└───────────────────────────────────────────│─────────────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         BACKEND (Node.js)                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────┐  │
│  │  GraphQL API    │───▶│  Chat Service   │───▶│  AI Service    │  │
│  │  /graphql       │    │                 │    │  (Gemini       │  │
│  └─────────────────┘    └─────────────────┘    │   Flash 2.0)   │  │
│                                │                └────────────────┘  │
│                                ▼                                    │
│                    ┌─────────────────────┐                         │
│                    │  Knowledge Base     │                         │
│                    │  Search Service     │                         │
│                    │  (Pages + Content)  │                         │
│                    └─────────────────────┘                         │
│                                │                                    │
│                                ▼                                    │
│                    ┌─────────────────────┐                         │
│                    │     Database        │                         │
│                    │  (SQLite/Postgres)  │                         │
│                    └─────────────────────┘                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📝 Task Breakdown

### Phase 1: Persiapan & Setup
| ID | Task | Status | Priority | Est. Time |
|----|------|--------|----------|-----------|
| 1.1 | Analisis struktur kode Wiki.js existing | ✅ Done | High | 2 jam |
| 1.2 | Identifikasi file welcome page | ✅ Done | High | 1 jam |
| 1.3 | Setup environment untuk AI (Google Gemini Flash 2.0) | ✅ Done | High | 2 jam |
| 1.4 | Buat branch baru `feat/chat-feature` | ✅ Done | High | 5 menit |

#### 📋 Phase 1 Analysis Results:

**Welcome Page Location:**
- `client/components/welcome.vue` - Main welcome component

**Key Files Identified:**
```
Frontend (Vue.js):
├── client/components/welcome.vue     # Target: Add Chat Button
├── client/store/user.js              # User auth state
├── client/client-app.js              # Apollo GraphQL setup
└── client/graph/                     # GraphQL queries

Backend (Node.js):
├── server/graph/schemas/             # GraphQL schemas (*.graphql)
├── server/graph/resolvers/           # GraphQL resolvers
├── server/modules/search/db/engine.js # DB search logic (reference)
└── server/controllers/common.js      # Routes handler
```

**GraphQL Pattern:**
- Schema di `server/graph/schemas/*.graphql`
- Resolver di `server/graph/resolvers/*.js`
- Auth directive: `@auth(requires: ["read:pages"])`

**Branch Created:** `feat/chat-feature`

### Phase 2: Backend Development
| ID | Task | Status | Priority | Est. Time |
|----|------|--------|----------|-----------|
| 2.1 | Buat GraphQL schema untuk Chat | ✅ Done | High | 1 jam |
| 2.2 | Buat Chat Service untuk handle messages | ✅ Done | High | 3 jam |
| 2.3 | Buat Knowledge Base Search Service | ✅ Done | High | 3 jam |
| 2.4 | Integrasi AI Service (Gemini Flash 2.0) | ✅ Done | High | 4 jam |
| 2.5 | Implement session-based chat storage | ✅ Done | Medium | 1 jam |
| 2.6 | Testing backend API | ⏳ Pending | High | 2 jam |

#### 📦 Backend Files Created:
- `server/graph/schemas/chat.graphql` - GraphQL schema
- `server/graph/resolvers/chat.js` - Chat resolver
- `server/modules/chat/gemini.service.js` - Gemini AI integration
- `server/modules/chat/knowledge.service.js` - KB search service
- `server/modules/chat/index.js` - Module entry point
- Installed: `@google/generative-ai` package

### Phase 3: Frontend Development
| ID | Task | Status | Priority | Est. Time |
|----|------|--------|----------|-----------|
| 3.1 | Buat komponen ChatButton | ⬜ Not Started | High | 1 jam |
| 3.2 | Tambahkan ChatButton ke Welcome Page | ⬜ Not Started | High | 30 menit |
| 3.3 | Buat halaman Chat (`/chat`) | ⬜ Not Started | High | 2 jam |
| 3.4 | Buat komponen ChatMessage | ⬜ Not Started | High | 1 jam |
| 3.5 | Buat komponen ChatInput | ⬜ Not Started | High | 1 jam |
| 3.6 | Buat komponen ChatContainer | ⬜ Not Started | High | 2 jam |
| 3.7 | Integrasi GraphQL queries/mutations | ⬜ Not Started | High | 2 jam |
| 3.8 | Styling & responsiveness | ⬜ Not Started | Medium | 2 jam |
| 3.9 | Loading states & error handling | ⬜ Not Started | Medium | 1 jam |

### Phase 4: Integrasi & Testing
| ID | Task | Status | Priority | Est. Time |
|----|------|--------|----------|-----------|
| 4.1 | Integrasi frontend dengan backend | ⬜ Not Started | High | 2 jam |
| 4.2 | End-to-end testing | ⬜ Not Started | High | 2 jam |
| 4.3 | Performance testing | ⬜ Not Started | Medium | 1 jam |
| 4.4 | Bug fixing | ⬜ Not Started | High | 3 jam |

### Phase 5: Documentation & Deployment
| ID | Task | Status | Priority | Est. Time |
|----|------|--------|----------|-----------|
| 5.1 | Update MANUAL.md dengan fitur chat | ⬜ Not Started | Medium | 1 jam |
| 5.2 | Buat dokumentasi API chat | ⬜ Not Started | Medium | 1 jam |
| 5.3 | Buat konfigurasi untuk AI provider | ⬜ Not Started | High | 1 jam |
| 5.4 | Final review & merge | ⬜ Not Started | High | 1 jam |

---

## 📁 File yang Akan Dibuat/Dimodifikasi

### Backend (server/)
```
server/
├── graph/
│   └── schemas/
│       └── chat.graphql          # [NEW] GraphQL schema untuk chat
├── modules/
│   └── chat/                     # [NEW] Chat module
│       ├── index.js              # Module entry point
│       ├── chat.service.js       # Chat business logic
│       ├── gemini.service.js     # Gemini Flash 2.0 integration
│       └── knowledge.service.js  # KB search service
├── models/
│   └── chatHistory.js            # [NEW] Optional: Chat history model
└── core/
    └── config.js                 # [MODIFY] Add AI config
```

### Frontend (client/)
```
client/
├── components/
│   └── chat/                     # [NEW] Chat components
│       ├── ChatButton.vue        # Tombol chat
│       ├── ChatContainer.vue     # Container utama
│       ├── ChatMessage.vue       # Komponen pesan
│       └── ChatInput.vue         # Input pesan
├── pages/
│   └── chat.vue                  # [NEW] Halaman chat
├── graph/
│   └── chat/                     # [NEW] GraphQL queries
│       ├── chat-send.gql
│       └── chat-history.gql
└── store/
    └── chat.js                   # [NEW] Vuex store untuk chat
```

### Konfigurasi
```
config.yml                        # [MODIFY] Add AI configuration
```

---

## 🔧 Konfigurasi yang Diperlukan

### config.yml (tambahan)
```yaml
# AI Chat Configuration
chat:
  enabled: true
  provider: gemini
  
  # Google Gemini Configuration
  gemini:
    apiKey: YOUR_GEMINI_API_KEY
    model: gemini-2.0-flash-exp
    maxTokens: 2048
    temperature: 0.7
    
  # Chat Settings
  settings:
    storage: session              # session only (tidak persist ke DB)
    requireLogin: true            # hanya user yang login
    searchAllPages: true          # search semua halaman based on query
    maxHistoryLength: 50
    welcomeMessage: "Halo! Saya adalah asisten Wiki.js. Tanyakan apa saja tentang dokumentasi kami."
```

---

## 🎨 UI/UX Design

### Welcome Page dengan Chat Button
```
┌─────────────────────────────────────────────────────────────┐
│                      WIKI.JS                                │
│                                                             │
│     ┌─────────────────────────────────────────────────┐    │
│     │                                                 │    │
│     │            Welcome to Your Wiki                 │    │
│     │                                                 │    │
│     │     [📖 Browse]  [🔍 Search]  [💬 Chat]       │    │
│     │                                                 │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Chat Page
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back                    Chat with Wiki.js AI             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🤖 Halo! Saya adalah asisten Wiki.js.               │   │
│  │    Tanyakan apa saja tentang dokumentasi kami.      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 👤 Bagaimana cara membuat halaman baru?             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🤖 Untuk membuat halaman baru di Wiki.js:           │   │
│  │                                                     │   │
│  │ 1. Klik tombol "+ New Page" di sidebar              │   │
│  │ 2. Pilih lokasi halaman (path)                      │   │
│  │ 3. Pilih editor (Markdown/Visual)                   │   │
│  │ 4. Tulis konten Anda                                │   │
│  │ 5. Klik "Create" untuk menyimpan                    │   │
│  │                                                     │   │
│  │ 📄 Referensi: /docs/guide/pages                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐  [Send]   │
│  │ Ketik pertanyaan Anda...                    │           │
│  └─────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Technical Specifications

### GraphQL Schema
```graphql
type ChatMessage {
  id: ID!
  role: ChatRole!
  content: String!
  references: [PageReference]
  createdAt: DateTime!
}

type PageReference {
  pageId: Int!
  path: String!
  title: String!
  relevanceScore: Float!
}

enum ChatRole {
  USER
  ASSISTANT
  SYSTEM
}

type Query {
  chatHistory(limit: Int): [ChatMessage]
}

type Mutation {
  sendChatMessage(content: String!): ChatMessage
  clearChatHistory: Boolean
}

type Subscription {
  chatMessageReceived: ChatMessage
}
```

### AI Prompt Template
```
You are a helpful assistant for a Wiki.js knowledge base.
Answer questions based ONLY on the provided context from the wiki pages.
If you don't find relevant information, say so politely.

Context from Wiki:
{relevant_pages_content}

User Question: {user_question}

Instructions:
- Be concise and helpful
- Reference specific pages when applicable
- Use markdown formatting for readability
- If unsure, suggest browsing the wiki directly
```

---

## 📊 Progress Tracking

### Overall Progress
```
Phase 1: Persiapan     [██████████] 100% ✅
Phase 2: Backend       [████████░░] 85%  ← Current
Phase 3: Frontend      [░░░░░░░░░░] 0%   ← Next
Phase 4: Testing       [░░░░░░░░░░] 0%
Phase 5: Documentation [░░░░░░░░░░] 0%
─────────────────────────────────────
Total Progress         [████░░░░░░] 37%
```

### Estimated Timeline
| Phase | Duration | Start | End |
|-------|----------|-------|-----|
| Phase 1 | 5 jam | TBD | TBD |
| Phase 2 | 15 jam | TBD | TBD |
| Phase 3 | 12 jam | TBD | TBD |
| Phase 4 | 8 jam | TBD | TBD |
| Phase 5 | 4 jam | TBD | TBD |
| **Total** | **~44 jam** | - | - |

---

## ✅ Konfigurasi yang Dikonfirmasi

| Item | Keputusan | Keterangan |
|------|-----------|------------|
| **AI Provider** | ✅ Google Gemini Flash 2.0 | Model: `gemini-2.0-flash-exp` |
| **Chat History** | ✅ Session Only | Hilang setelah refresh/logout |
| **Akses Chat** | ✅ Hanya User Login | Guest tidak bisa akses |
| **Scope KB** | ✅ Semua Halaman | Search based on query |
| **Additional Features** | ✅ Standard Only | Fitur dasar dulu |

---

## 🚀 Approval Status

```
✅ Plan reviewed
✅ AI provider confirmed: Gemini Flash 2.0
✅ Scope confirmed: Session storage, Login required
✅ Timeline approved
✅ Ready to start Phase 1
```

**STATUS: APPROVED ✅**

---

*Plan dibuat: 5 Desember 2025*
*Status: APPROVED - Ready for Development*
