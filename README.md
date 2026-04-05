<div align="center">

<br/>

```
██╗      █████╗ ███╗   ██╗██████╗ ███████╗███╗   ███╗ ██████╗ ███╗   ██╗
██║     ██╔══██╗████╗  ██║██╔══██╗██╔════╝████╗ ████║██╔═══██╗████╗  ██║
██║     ███████║██╔██╗ ██║██║  ██║█████╗  ██╔████╔██║██║   ██║██╔██╗ ██║
██║     ██╔══██║██║╚██╗██║██║  ██║██╔══╝  ██║╚██╔╝██║██║   ██║██║╚██╗██║
███████╗██║  ██║██║ ╚████║██████╔╝███████╗██║ ╚═╝ ██║╚██████╔╝██║ ╚████║
╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
```

**Browse. Stream. Watch Together.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel)](https://lande-mon.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Live](https://img.shields.io/badge/Live-lande--mon.vercel.app-blue?style=flat-square)](https://lande-mon.vercel.app/)

<br/>

[**Live Demo**](https://lande-mon.vercel.app/) · [**Report Bug**](https://github.com/lande26/LandeMon/issues) · [**Request Feature**](https://github.com/lande26/LandeMon/issues)

<br/>

</div>

---

## What is LandeMon?

LandeMon is a full-stack streaming platform for browsing and watching **Movies, TV Shows, and Anime** — with a real-time **Watch Party** feature that lets you watch together with friends, powered by WebRTC.

Built with Next.js 14 App Router, it combines a multi-provider streaming engine, edge-cached metadata, LiveKit-powered watch parties, and a Neon Postgres persistence layer — all deployed on Vercel's free tier.

---

## Features

### 🎬 &nbsp;Browse & Stream
- 500,000+ movies, TV shows, and anime via **TMDb API** with ratings, trailers, cast, and recommendations.
- Full season/episode navigation for TV shows and anime.
- Server selector dropdown with **8 streaming providers** and an Auto mode that picks the fastest available.

### 🎉 &nbsp;Watch Party (LiveKit WebRTC)
- **Create a party** from any watch page — a shareable 6-character room code is generated instantly.
- **Party Lobby** — Browse all active parties in a centralized dashboard at `/party`.
- **Pre-join Screen** — Camera & mic preview before entering the room, modeled after Google Meet.
- **LiveKit WebRTC Room** — Real-time video/audio chat with all participants.
- **Screen Share + Theater Mode** — Host can share their screen; a dedicated pop-out "Theater" window prevents the infinity-mirror effect.
- **Floating Participant Grid** — Webcam feeds are shown as floating tiles over the video area.
- **Real-time Chat** — Built-in chat panel using LiveKit Data Channels (no extra backend).
- **Sync Controls** — Host broadcasts server/episode state to all guests via Data Channels.
- **Auto-cleanup** — Party rooms expire after 4 hours in Upstash Redis.

### 🔐 &nbsp;Authentication
- **NextAuth v5** (Auth.js) with **Google** and **GitHub** OAuth providers.
- JWT-based sessions with Prisma Adapter persisting users to Neon Postgres.
- **Auth-guarded routes** — Middleware redirects unauthenticated users from `/profile`, `/bookmarks`, and `/party`.
- **Premium Auth Modal** — Guest users clicking Watch Party, Bookmarks, or History see a seamless sign-in popup instead of a redirect.

### 🔖 &nbsp;Bookmarks & Watch History
- **Bookmarks** — Save movies/shows to your personal list, synced to Postgres via tRPC mutations.
- **Watch History** — Auto-logged when a stream loads, with progress tracking. Accessible from the `/history` page.
- Both are persisted to **Neon Postgres** and accessible across devices.

### ⚡ &nbsp;Edge Caching (Upstash Redis)
- All TMDb API responses are cached via a **Read-Through Cache** utility with configurable TTLs.
- Sub-10ms cache hits on Upstash Redis (serverless, globally replicated).
- Graceful degradation: on Redis failure, falls back to direct TMDb fetch.
- Versioned cache keys (`v3:` prefix) to enable safe cache busting.

### 🔁 &nbsp;Stream Fallback Chain
- 7+ streaming providers in a priority-ordered list.
- Server-side **ping-based fallback**: each provider is probed with a 3s timeout; the first responsive one is selected and cached for 1 hour.
- **Client-side Auto mode**: when server pinging is disabled (Vercel/Railway), the full provider list is returned and the client tries each via iframe load detection with 4s timeout.
- Anime-specific embed URLs with sub/dub support.

### 🛡️ &nbsp;Cloudflare Ad-Proxy (Disabled)
- A Cloudflare Worker (`ad-proxy-worker/`) designed to intercept and strip ads/popups from streaming provider iframes.
- Currently **disabled in production** due to buffering issues — streams load directly from providers instead.

### 🌙 &nbsp;UI & Design
- Dark-themed, responsive UI built with **Tailwind CSS** and **Framer Motion** animations.
- **Radix UI** primitives for dialogs, dropdowns, tooltips, accordions, and navigation.
- **Particle effects** on the landing page via `@tsparticles`.
- Mobile-responsive layouts with `100dvh` fullscreen video player.
- **Sonner** toast notifications for party events.
- **next-themes** for theme management.

---

## Architecture

```
┌─────────────┐    ┌──────────────────┐    ┌─────────────────────────────────┐
│   Client    │───▶│   Edge / CDN     │───▶│        Compute (Vercel)         │
│             │    │                  │    │                                 │
│  Next.js 14 │    │ Vercel CDN       │    │  App Router (RSC + Client)      │
│  App Router │    │ ISR / Static     │    │  middleware.ts (auth guard)      │
│             │    │                  │    │  /api/stream (fallback chain)   │
└─────────────┘    └──────────────────┘    │  /api/livekit (WebRTC tokens)   │
                                           │  /api/party/* (CRUD)            │
                                           │  /api/trpc/* (bookmarks, hist.) │
                                           └───────────────┬─────────────────┘
                                                           │
                      ┌────────────────────────────────────┼─────────────────────┐
                      │                                    │                     │
               ┌──────▼──────┐                   ┌────────▼─────┐    ┌──────────▼──────┐
               │ Data Layer  │                   │   LiveKit    │    │ Stream Providers │
               │             │                   │  (WebRTC)    │    │                  │
               │ Neon PG     │                   │ Video/Audio  │    │ vidsrc.cc        │
               │ Prisma ORM  │                   │ Screen Share │    │ vidsrc.xyz       │
               │ Upstash     │                   │ Data Channel │    │ vidlink.pro      │
               │ Redis       │                   │ (Chat+Sync)  │    │ smashystream     │
               └─────────────┘                   └──────────────┘    │ vidbinge, vidnest│
                                                                     │ riveembed        │
                                                                     └──────────────────┘
```

### Key Design Decisions

| Decision | Why |
|---|---|
| **LiveKit WebRTC** for Watch Party | Provides video/audio/screen-share and data channels in a single SDK — no need for separate signaling or chat servers. |
| **Screen Share + Theater Mode** | Host pops out a minimal Theater window to share, preventing the "infinity mirror" recursion when screen sharing a page that contains itself. |
| **Upstash Redis for party rooms** | Serverless, auto-expiring keys (4h TTL) mean no ghost rooms, no cleanup cron jobs, and zero idle cost. |
| **Read-Through Cache pattern** | A single `getCached()` utility wraps every TMDb call. Cache miss → fetch → background write. Redis failure → transparent fallback. |
| **7-provider fallback chain** | Any single streaming CDN can go down. The chain (server-side ping or client-side iframe probe) ensures playback never breaks. |
| **tRPC for data mutations** | Type-safe end-to-end mutations for bookmarks and watch history without manually writing fetch calls or REST routes. |
| **NextAuth v5 + Prisma** | JWT sessions for speed, Prisma Adapter for persistence. Split `auth.config.ts` / `auth.ts` pattern enables middleware compatibility. |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router, RSC) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) (Dialog, Dropdown, Tooltip, Accordion, Navigation) |
| **Auth** | [NextAuth v5](https://authjs.dev/) (Google + GitHub OAuth, JWT sessions) |
| **Database** | [Neon Postgres](https://neon.tech/) (Serverless) |
| **ORM** | [Prisma 5](https://www.prisma.io/) |
| **Cache** | [Upstash Redis](https://upstash.com/) (Serverless, REST-based) |
| **API Layer** | [tRPC 10](https://trpc.io/) + Next.js Route Handlers |
| **Real-time** | [LiveKit](https://livekit.io/) (WebRTC video/audio/screen/data) |
| **State** | [Zustand 4](https://zustand-demo.pmnd.rs/) + [TanStack React Query 4](https://tanstack.com/query) |
| **Validation** | [Zod 3](https://zod.dev/) + [T3 Env](https://env.t3.gg/) |
| **Deployment** | [Vercel](https://vercel.com/) |
| **Analytics** | [Vercel Analytics](https://vercel.com/analytics) + [Speed Insights](https://vercel.com/docs/speed-insights) |
| **Linting** | ESLint + Prettier + Husky + lint-staged |

---

## Project Structure

```
LandeMon/
├── ad-proxy-worker/          # Cloudflare Worker for ad mitigation (disabled)
│   ├── src/
│   ├── wrangler.toml
│   └── package.json
├── prisma/
│   ├── schema.prisma          # User, Account, Session, Bookmark, WatchHistory, Review
│   └── migrations/
├── public/
├── src/
│   ├── app/
│   │   ├── (front)/           # Main browsing pages (layout with nav)
│   │   │   ├── home/          # Home page
│   │   │   ├── movies/        # Movies listing + detail
│   │   │   ├── tv-shows/      # TV Shows listing + detail
│   │   │   ├── anime/         # Anime listing + detail
│   │   │   ├── bookmarks/     # User bookmarks
│   │   │   ├── history/       # Watch history
│   │   │   ├── search/        # Search results
│   │   │   ├── new-and-popular/
│   │   │   └── party/         # Party Lobby (active rooms list)
│   │   ├── watch/
│   │   │   ├── movie/[slug]/  # Movie player
│   │   │   ├── tv/[slug]/     # TV player
│   │   │   └── anime/[slug]/  # Anime player
│   │   ├── party/
│   │   │   └── [roomId]/      # Party join screen → watch room
│   │   ├── api/
│   │   │   ├── stream/        # Stream URL resolver (fallback chain)
│   │   │   ├── livekit/       # LiveKit access token generation
│   │   │   ├── party/         # Party CRUD (create, list, end)
│   │   │   ├── auth/          # NextAuth route handlers
│   │   │   └── trpc/          # tRPC route handler
│   │   ├── sitemap/
│   │   └── layout.tsx         # Root layout (providers, fonts, analytics)
│   ├── components/
│   │   ├── party/             # Watch Party UI components
│   │   │   ├── watch-party-client.tsx   # Main party room (LiveKit integration)
│   │   │   ├── party-join-screen.tsx    # Pre-join camera/mic setup
│   │   │   ├── control-bar.tsx          # Bottom media controls
│   │   │   ├── chat-panel.tsx           # Data-channel chat
│   │   │   ├── participant-grid.tsx     # Floating webcam grid
│   │   │   ├── sync-controls.tsx        # Host sync broadcasting
│   │   │   └── sync-notification.tsx    # Guest sync toast
│   │   ├── watch/
│   │   │   └── embed-player.tsx         # Universal embed player (8 servers)
│   │   ├── navigation/        # Navbar, sidebar
│   │   ├── auth/              # Auth modal, sign-in/out buttons
│   │   ├── ui/                # Shared UI primitives
│   │   ├── hero.tsx           # Landing hero with particles
│   │   ├── shows-carousel.tsx # Horizontal content carousels
│   │   ├── shows-modal.tsx    # Detail modal (ratings, cast, trailer)
│   │   └── season.tsx         # Season/episode selector
│   ├── server/
│   │   ├── trpc.ts            # tRPC context & procedure builders
│   │   ├── index.ts           # App router
│   │   └── routers/
│   │       ├── bookmarks.ts   # Bookmark CRUD
│   │       └── watchHistory.ts # History logging
│   ├── services/
│   │   ├── MovieService/      # TMDb API wrapper (movies, tv, search, keywords)
│   │   └── BaseService/       # Axios base with interceptors
│   ├── lib/
│   │   ├── cache.ts           # Read-Through Cache (Upstash Redis)
│   │   ├── party.ts           # Party room CRUD (Redis-backed)
│   │   ├── utils.ts           # Slug generation, metadata, helpers
│   │   └── constants.ts
│   ├── stores/                # Zustand stores
│   │   ├── modal.ts           # Shows modal state
│   │   ├── search.ts          # Search state
│   │   └── auth-modal.ts      # Auth guard modal state
│   ├── hooks/                 # Custom React hooks
│   ├── configs/site.ts        # Site metadata, nav items
│   ├── types/                 # TypeScript types (Show, Season, Episode, etc.)
│   ├── enums/                 # MediaType enum
│   ├── auth.ts                # NextAuth instance (Prisma Adapter)
│   ├── auth.config.ts         # Auth providers & JWT callbacks
│   ├── middleware.ts          # Route protection middleware
│   └── env.mjs               # T3 Env validation (Zod schemas)
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── LICENSE
```

---

## Database Schema

The Prisma schema defines six models on **Neon Postgres**:

| Model | Purpose |
|---|---|
| `User` | OAuth user profiles (Google, GitHub) |
| `Account` | OAuth provider tokens (multi-provider support) |
| `Session` | Session tokens (JWT-backed) |
| `VerificationToken` | Email verification tokens |
| `Bookmark` | User-saved movies/shows (unique per user + tmdbId + mediaType) |
| `WatchHistory` | Auto-logged playback history with progress tracking |
| `Review` | User ratings and reviews |

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# ─── Database (Neon Postgres) ───
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# ─── Auth (NextAuth v5) ───
AUTH_SECRET="your-auth-secret"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

# ─── Cache (Upstash Redis) ───
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# ─── LiveKit (Watch Party) ───
LIVEKIT_API_KEY="..."
LIVEKIT_API_SECRET="..."
NEXT_PUBLIC_LIVEKIT_URL="wss://your-livekit-server.livekit.cloud"

# ─── TMDb API ───
NEXT_PUBLIC_TMDB_TOKEN="your-tmdb-read-access-token"

# ─── App ───
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="LandeMon"

# ─── Optional ───
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=""
NEXT_PUBLIC_TWITTER="https://x.com/KartikLande15"
NEXT_PUBLIC_AD_PROXY_URL=""
NEXT_PUBLIC_IMAGE_DOMAIN=""
DISABLE_PROVIDER_PING="0"         # Set to "1" on Vercel/Railway
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A [Neon](https://neon.tech/) Postgres database
- An [Upstash](https://upstash.com/) Redis instance
- A [LiveKit Cloud](https://livekit.io/) project (free tier works)
- [TMDb API](https://developer.themoviedb.org/) read access token
- Google and/or GitHub OAuth credentials

### Installation

```bash
# Clone the repository
git clone https://github.com/lande26/LandeMon.git
cd LandeMon

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Push the Prisma schema to your database
npx prisma db push

# Generate the Prisma client
npx prisma generate

# Start the development server
npm run dev
```

The app will be running at [http://localhost:3000](http://localhost:3000).

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint with auto-fix |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | Run TypeScript type checking |

---

## Deployment

The app is deployed on **Vercel** at [lande-mon.vercel.app](https://lande-mon.vercel.app/).

1. Push to your GitHub repo.
2. Import the project in [Vercel](https://vercel.com/).
3. Add all environment variables in the Vercel dashboard.
4. Set `DISABLE_PROVIDER_PING=1` — streaming CDNs block Vercel's IP ranges, so Auto mode falls back to client-side probing.
5. Prisma generates automatically via the `postinstall` script.

---

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/stream` | GET | Resolves the best streaming embed URL via the fallback chain |
| `/api/livekit` | GET | Generates a LiveKit access token for a party room |
| `/api/party/create` | POST | Creates a new Watch Party room in Redis |
| `/api/party/list` | GET | Lists all active party rooms |
| `/api/party/end` | POST | Deletes a party room (host only) |
| `/api/auth/*` | * | NextAuth route handlers |
| `/api/trpc/*` | * | tRPC endpoint (bookmarks, watch history) |

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ by [Kartik Lande](https://github.com/lande26)

</div>
