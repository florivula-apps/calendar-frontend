# Template Frontend Mobile Web

A mobile-first Progressive Web App (PWA) template built with React, TypeScript, Tailwind CSS, and Vite. Designed for phone-first experiences with bottom navigation, card-based layouts, and offline support.

## Stack

- **React 18** + TypeScript (strict mode)
- **Vite 5** + vite-plugin-pwa
- **Tailwind CSS 3** + shadcn/ui components
- **TanStack React Query 5** for data fetching
- **React Router 6** for navigation
- **Axios** with JWT interceptors
- **Lucide React** icons

## Features

- Bottom navigation bar (no sidebar)
- Card-based layouts (no data tables)
- Pull-to-refresh on lists
- Floating action button
- PWA with service worker and offline fallback
- Safe area insets for iPhone notch
- Touch targets minimum 44x44px
- Full-width mobile-optimized forms
- JWT authentication with token refresh

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (port 5174)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Docker

```bash
# Build and run
docker compose up --build

# Or use the deploy script
./deploy.sh
```

## Project Structure

```
src/
  components/     # Reusable UI components
  contexts/       # React contexts (Auth)
  hooks/          # Custom hooks
  layouts/        # Page layouts (MobileLayout)
  lib/            # Utilities and API client
  pages/          # Page components
  types/          # TypeScript type definitions
public/
  icons/          # PWA icons
  manifest.json   # PWA manifest
  offline.html    # Offline fallback
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `/api` | Backend API base URL |
| `VITE_APP_NAME` | `App Template` | Application name |
