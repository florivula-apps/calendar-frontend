# CLAUDE.md - Project Context for AI Assistants

## Project: template-frontend-mobile-web

Mobile-first Progressive Web App (PWA) template. React 18 + TypeScript + Vite 5 + Tailwind CSS 3 + shadcn/ui.

## Key Patterns

- **Mobile-first**: Bottom navigation, no sidebar. Card-based layouts, no data tables.
- **Touch targets**: Minimum 44x44px on all interactive elements.
- **Safe areas**: Uses `env(safe-area-inset-*)` for iPhone notch compatibility.
- **PWA**: Service worker with offline fallback, manifest for install prompt.
- **Auth**: JWT tokens in localStorage with automatic refresh via Axios interceptors.
- **Data fetching**: TanStack React Query with pull-to-refresh support.

## Commands

```bash
npm run dev      # Start dev server on port 5174
npm run build    # TypeScript check + Vite build
npm run preview  # Preview production build
npm run lint     # ESLint
```

## Architecture

- `src/layouts/MobileLayout.tsx` - Fixed header (48px) + content + fixed bottom nav (56px)
- `src/components/BottomNav.tsx` - 4 tabs: Home, Items, Create, Profile
- `src/lib/api.ts` - Axios instance with JWT interceptors and token refresh
- `src/contexts/AuthContext.tsx` - Authentication state management
- `src/hooks/useItems.ts` - React Query hooks for CRUD operations
- `src/components/PullToRefresh.tsx` - Touch-based pull-to-refresh

## Conventions

- Path alias: `@/` maps to `src/`
- All form inputs use `font-size: 16px` to prevent iOS zoom
- shadcn/ui components in `src/components/ui/`
- API proxy: `/api` -> `http://localhost:3001`
- Dev server port: 5174
