# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Lite-Wiki** is a lightweight, intelligent knowledge base for student groups and startup teams. Built with React and TypeScript, featuring AI-powered document management, team collaboration, and knowledge organization.

### Tech Stack
- **Frontend**: React 18.2.0, TypeScript, Vite 6.2.0
- **Data Fetching**: TanStack React Query (@tanstack/react-query)
- **State Management**: Zustand
- **UI Framework**: Material UI (@mui/material), TailwindCSS
- **Markdown**: md-editor-rt, react-markdown, remark-gfm
- **Routing**: React Router DOM 6.23.1 (hash-based)
- **AI Integration**: Google Gemini API

## Development Commands

### Setup
```bash
pnpm install  # or npm install
```

### Development
```bash
npm run dev   # Start dev server on port 3001
```

### Build & Preview
```bash
npm run build   # Production build
npm run preview # Preview build on port 4173
```

### Environment Variables
Create `.env.local`:
```env
GEMINI_API_KEY=your_api_key_here
SERVER_API_URL=http://localhost:8000  # For API proxy
```

API key is injected via Vite's `define` config in `vite.config.ts:24-26`.

## Architecture

### Core Structure

**Routing** (`App.tsx:30-127`): Uses `createHashRouter` with nested dashboard routes. The app wraps the router with:
- `QueryClientProvider` - TanStack Query client
- `LanguageProvider` - i18n context

**Key Files**:
- `constants.ts` - Route definitions (ROUTES object) and mock data
- `types.ts` - Centralized TypeScript interfaces
- `lib/queryClient.ts` - TanStack Query configuration (5min stale time, 1 retry)
- `lib/i18n.tsx` - Internationalization (Chinese default, localStorage persistence)
- `vite.config.ts` - Build config, dev server (port 3001), API proxy

### State Management

- **TanStack Query**: Server state (caching, refetching)
- **Zustand**: Client state management
- **React Context**: Language switching
- **Mock Data**: `MOCK_USER` in `constants.ts:30-36`

### Version Control System

Documents support versioning with states (`types.ts:4`):
- `working` - Active editing
- `locked` - Read-only
- `archived` - Stored but not active
- `deprecated` - Superseded

### Authentication

Multiple auth flows (`pages/`):
- Email/password login
- Anonymous/guest access
- Phone registration with verification
- Role-based access: `admin`, `user`, `team_leader`

### Team Features

Team hub (`/dashboard/team`) with nested routes:
- `/forum` - Team discussions
- `/wiki` - Team knowledge base
- `/directory` - Member directory
- `/management` - Admin controls

### Internationalization

Default language is Chinese (`zh`), supports English (`en`). Language preference persists in localStorage. All UI text is in `lib/i18n.tsx` with the `TranslationSchema` interface.

### Path Aliases

`@/*` maps to project root (configured in `tsconfig.json:21-24` and `vite.config.ts:29-31`).

## Dependencies

**Core**:
- `react`, `react-dom` - Framework
- `react-router-dom` - Hash-based routing
- `@tanstack/react-query` - Data fetching
- `zustand` - State management
- `@mui/material` - UI components
- `tailwindcss` - Styling

**Markdown & Editor**:
- `md-editor-rt` - Rich text editor
- `react-markdown` + `remark-gfm` - Rendering

**Other**:
- `lucide-react` - Icons
- `axios` - HTTP client
- `jsonwebtoken` - Auth tokens

## Build Configuration

- **Dev Server**: `0.0.0.0:3001` with HMR
- **Build Tool**: Vite with SWC plugin (`@vitejs/plugin-react-swc`)
- **API Proxy**: `/api` requests forward to `SERVER_API_URL`
- **Module**: ESNext with bundle resolution
- **No ESLint/Prettier**: No linting configuration found

## Development Patterns

### Adding Routes
1. Define route in `constants.ts` (ROUTES object)
2. Import component in `App.tsx`
3. Add route configuration to `createHashRouter` children array

### Working with Data
- Use TanStack Query hooks for server state
- Configure in `lib/queryClient.ts`
- Default: 5min stale time, 1 retry

### Internationalization
- Add keys to `TranslationSchema` interface
- Update translations object in `lib/i18n.tsx`
- Requires both `zh` and `en` values

### Environment
- Dev server port: 3001 (see `vite.config.ts:8-10`)
- API proxy configured in `vite.config.ts:15-21`
- Gemini API key via `GEMINI_API_KEY` env var
