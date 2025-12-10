# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Lite-Wiki** is a lightweight, intelligent knowledge base designed for student groups and startup teams. It's a React-based web application with AI-powered features for document management, team collaboration, and knowledge organization.

### Tech Stack
- **Framework**: React 18.2.0 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Routing**: React Router DOM 6.23.1
- **UI Icons**: Lucide React
- **Markdown**: react-markdown with remark-gfm
- **API**: Integrates with Google Gemini AI

## Development Commands

### Installation
```bash
pnpm install  # or npm install
```

### Development
```bash
npm run dev   # Start dev server on port 3000
```

### Building
```bash
npm run build   # Production build
npm run preview # Preview production build locally
```

### Environment Setup
Create a `.env.local` file in the root directory with:
```env
GEMINI_API_KEY=your_api_key_here
```

The API key is injected into the app via Vite's `define` configuration in `vite.config.ts`.

## Project Architecture

### Directory Structure
```
/
├── App.tsx                 # Main app component with routing configuration
├── index.tsx              # Application entry point
├── constants.ts           # App constants and routes definition
├── types.ts               # TypeScript type definitions
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── components/
│   ├── layout/            # Layout components (Navbar, Footer, DashboardLayout)
│   ├── dashboard/         # Dashboard-specific components
│   └── ui/                # Reusable UI components (Button, Input)
├── pages/
│   ├── Portal.tsx         # Landing page
│   ├── Login.tsx          # Authentication pages
│   ├── Register.tsx
│   ├── AnonymousLogin.tsx
│   ├── ForgotPassword.tsx
│   └── dashboard/         # Dashboard pages
│       ├── Overview.tsx
│       ├── Editor.tsx     # Markdown editor with versioning
│       ├── Community.tsx  # Community hub
│       ├── KnowledgeCenter.tsx  # AI knowledge assistant
│       ├── Team.tsx       # Team space with sub-pages
│       ├── Favorites.tsx
│       ├── Recent.tsx
│       ├── Trash.tsx
│       ├── Notifications.tsx
│       └── UserProfile.tsx
├── lib/
│   └── i18n.tsx           # Internationalization (zh/en)
└── assets/
    └── icon.ico
```

### Routing Architecture

The app uses **Hash-based routing** via `createHashRouter`. Main routes:
- `/` - Portal (landing page)
- `/login`, `/register`, `/anonymous-login`, `/forgot-password` - Auth pages
- `/dashboard/*` - Dashboard with nested routes for:
  - `/overview` - Dashboard home
  - `/documents` - Document editor
  - `/community` - Community discussions
  - `/knowledge` - AI assistant
  - `/team` - Team hub with nested routes (forum, wiki, directory, management)
  - `/favorites`, `/recent`, `/trash` - Library views
  - `/profile`, `/notifications` - User management

### Key Architecture Patterns

1. **Language Context** (`lib/i18n.tsx:1367-1398`): Provides internationalization support with React Context and localStorage persistence. Default language is Chinese (`zh`).

2. **Type Definitions** (`types.ts`): Centralized TypeScript interfaces for:
   - File system types (FileNode, FileVersion)
   - User and team management (User, TeamMember, TeamPost)
   - Community features (CommunityTopic, CommunityPost)
   - AI messaging (AIMessage)
   - Notifications (NotificationItem)

3. **Version Control**: Documents support versioning with states: `working`, `locked`, `archived`, `deprecated` (see `types.ts:4`)

4. **Mock Data**: Uses `MOCK_USER` from `constants.ts:30-36` for demonstration purposes

### Development Workflow

- **Path Alias**: Use `@/` to reference root directory (configured in `tsconfig.json:21-24` and `vite.config.ts:18-20`)
- **Type Safety**: Full TypeScript support with strict configuration
- **Component Organization**: Feature-based structure with shared UI components
- **State Management**: React hooks and Context API (for i18n)

## Common Development Tasks

### Adding a New Page
1. Create component in appropriate `pages/` subdirectory
2. Add route definition to `constants.ts` (ROUTES object)
3. Register route in `App.tsx` using `createHashRouter`

### Working with Markdown
- The editor supports Markdown with live preview (see `Editor.tsx`)
- Use `react-markdown` and `remark-gfm` for rendering
- Comments and collaboration features built-in

### Adding Translations
- Edit `lib/i18n.tsx` translations object
- Add keys to `TranslationSchema` interface
- Both English and Chinese translations required
- Language preference saved in localStorage

### AI Integration
- Gemini API key required in `.env.local`
- Currently used in Knowledge Center and AI assistant features
- API key injected via Vite's `define` config (see `vite.config.ts:14-15`)

## Important Notes

1. **Anonymous Login**: Supports guest access without registration (see `AnonymousLogin.tsx`)
2. **Role-Based Access**: User roles include `admin`, `user`, `team_leader`
3. **Team Collaboration**: Team features include forums, wikis, member directory, and management
4. **Internationalization**: Default language is Chinese (zh), supports English (en)
5. **No Testing**: No test configuration found in package.json
6. **No Linting**: No ESLint or Prettier configuration found

## Dependencies

Key runtime dependencies:
- `react`, `react-dom` - Core React framework
- `react-router-dom` - Routing
- `react-markdown`, `remark-gfm` - Markdown rendering
- `lucide-react` - UI icons

Key dev dependencies:
- `vite` - Build tool
- `@vitejs/plugin-react` - React plugin for Vite
- `typescript` - TypeScript compiler
- `@types/node` - Node.js types

## Environment Configuration

- **Dev Server**: Runs on `http://0.0.0.0:3000` (see `vite.config.ts:8-11`)
- **Port**: 3000 (configurable in vite.config.ts)
- **API Key**: Gemini API key must be set in `.env.local` as `GEMINI_API_KEY`
