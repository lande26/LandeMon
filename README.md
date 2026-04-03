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

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel)](https://lande-mon.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Live](https://img.shields.io/badge/Live-lande--mon.vercel.app-blue?style=flat-square)](https://lande-mon.vercel.app/)

<br/>

[**Live Demo**](https://lande-mon.vercel.app/) · [**Report Bug**](https://github.com/lande26/LandeMon/issues) · [**Request Feature**](https://github.com/lande26/LandeMon/issues)

<br/>

</div>

---

## What is Landemon?

Landemon is a distributed streaming platform to browse and stream **500,000+ movies and TV shows** powered by the TMDb API. It's built as a side project — but engineered like it isn't.

The stack is designed around real distributed systems principles: edge caching, serverless connection pooling, WebRTC-based watch parties, and a 6-provider circuit breaker fallback chain for uninterrupted playback. Everything runs at **$0/month**.

---

## Features

- 🎬 &nbsp;**Browse & Stream** — 500,000+ movies and TV shows via TMDb API with ratings, cast, and recommendations
- 🔐 &nbsp;**Auth** — Google & GitHub OAuth via NextAuth.js with cross-device session persistence
- 🔖 &nbsp;**Bookmarks & Watch History** — synced to Neon Postgres, accessible on any device
- ⚡ &nbsp;**Edge-cached responses** — TMDb API calls cached in Upstash Redis, sub-10ms cache hits
- 🎉 &nbsp;**Watch Party** — invite friends, watch together, video/mic via LiveKit WebRTC
- 💬 &nbsp;**Real-time Chat** — built into Watch Party via LiveKit Data Channels
- 📡 &nbsp;**Sync Controls** — host broadcasts play/pause/seek signals to all guests
- 🔁 &nbsp;**Stream Fallback Chain** — 6 providers with circuit breaker, never breaks mid-watch
- 🌙 &nbsp;**Dark/Light theme** — clean UI with responsive layout and Tailwind CSS

---

## Architecture

Landemon is split into five distinct layers, each independently scalable:

```
┌─────────────┐    ┌──────────────────┐    ┌─────────────────────────────────┐
│   Client    │───▶│   Edge / CDN     │───▶│        Compute (Vercel)         │
│             │    │                  │    │                                 │
│  Browser /  │    │ Vercel Edge ISR  │    │  Next.js App Router             │
│  Next.js    │    │ next/image CDN   │    │  middleware.ts (auth guard)     │
│             │    │ (WebP cache)     │    │  /api/movies/* (TMDb + cache)   │
└─────────────┘    └──────────────────┘    │  /api/stream/[tmdbId] (chain)  │
                                           │  /api/livekit (WebRTC token)   │
                                           └───────────────┬─────────────────┘
                                                           │
                          ┌────────────────────────────────┼─────────────────────┐
                          │                                │                     │
                   ┌──────▼──────┐                ┌───────▼──────┐    ┌─────────▼───────┐
                   │ Data Layer  │                │   LiveKit    │    │ Stream Providers│
                   │             │                │  (WebRTC)    │    │                 │
                   │ Neon PG     │                │ video + mic  │    │ vidsrc.cc       │
                   │ Upstash     │                │ + chat       │    │ vidsrc.to       │
                   │ Redis       │                └──────────────┘    │ autoembed.cc    │
                   │ Prisma ORM  │                                    │ smashystream    │
                   └─────────────┘                                    │ multiembed      │
                                                                      │ 2embed ↓        │
                                                                      └─────────────────┘
```

### Key Design Decisions

| Decision | Why |
|---|---|
| Vercel over Cloudflare for hosting | Next.js ISR and App Router work natively with Vercel — no config overhead |
| Pusher replaced by LiveKit Data Channels | LiveKit handles WebRTC + sync signals + chat in one service |
| Upstash Redis for caching | Serverless, pay-per-request, globally replicated — no idle cost |
| Prisma Accelerate for connection pooling | Vercel serverless opens new DB connections per invocation — Accelerate pools them |
| 6-provider fallback chain | Any single provider can go down — the chain ensures playback never breaks |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | NextAuth.js v5 (Google + GitHub OAuth) |
| Database | Neon Serverless Postgres |
| ORM | Prisma + Prisma Accelerate |
| Cache | Upstash Redis |
| Watch Party | LiveKit (WebRTC video/mic/chat) |
| Deployment | Vercel |
| Movie Data | TMDb API |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [TMDb API key](https://www.themoviedb.org/settings/api)
- A [Neon](https://neon.tech) database
- An [Upstash Redis](https://upstash.com) instance
- A [LiveKit Cloud](https://livekit.io/cloud) account (free tier)
- Google & GitHub OAuth credentials

### Installation

```bash
# Clone the repo
git clone https://github.com/lande26/LandeMon.git
cd LandeMon

# Install dependencies
npm install

# Copy env file
cp .env.example .env.local
```

### Environment Variables

```env
# TMDb
NEXT_PUBLIC_TMDB_API_KEY=

# Database
DATABASE_URL=                    # Prisma Accelerate proxy URL
DIRECT_URL=                      # Direct Neon connection (for migrations)

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# LiveKit
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=
```

### Database Setup

```bash
# Push schema to Neon
npx prisma migrate dev

# Or for production
npx prisma migrate deploy
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Watch Party

Landemon's Watch Party lets you watch anything with friends — with real video and voice, not just a chat box.

**How it works:**
1. Open any movie or show → click **Start Watch Party**
2. Share the room link with friends
3. Everyone joins, approves camera/mic (off by default)
4. Host broadcasts sync signals — guests get notified to play/pause
5. Chat, react, and watch together in real time

**Under the hood:**
- Room state (movie ID, host, metadata) stored in Upstash Redis with 4-hour TTL
- LiveKit handles all WebRTC peer connections — video, mic, and data channels
- Sync signals (play/pause/seek) sent via LiveKit Data Channels — no extra service needed
- Host disconnect detected via LiveKit room events → guests auto-redirected

---

## Stream Fallback Chain

No single streaming provider is 100% reliable. Landemon tries providers in order and falls back automatically:

```
vidsrc.cc → vidsrc.to → autoembed.cc → smashystream → multiembed.mov → 2embed.cc
```

Each provider has a 3-second timeout. The last working provider per title is cached in Redis (24hr TTL) so repeat views skip the chain entirely.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── movies/          # TMDb aggregation with Redis caching
│   │   ├── stream/          # 6-provider fallback chain
│   │   ├── party/           # Watch Party room management
│   │   ├── livekit/         # WebRTC token generation
│   │   ├── bookmark/        # Bookmark CRUD
│   │   ├── history/         # Watch history tracking
│   │   └── auth/            # NextAuth handlers
│   ├── party/[roomId]/      # Watch Party room pages
│   └── (pages)/             # Home, Browse, Movie detail, etc.
├── components/
│   ├── party/               # WatchPartyClient, ParticipantGrid, SyncControls
│   └── ui/                  # Shared UI components
├── lib/
│   ├── cache.ts             # Redis read-through cache utility
│   ├── party.ts             # Room state management
│   ├── prisma.ts            # Prisma client singleton
│   └── pusher.ts            # (legacy, replaced by LiveKit)
└── prisma/
    └── schema.prisma        # DB schema
```

---

## Roadmap

- [x] Browse 500,000+ movies and TV shows
- [x] Google & GitHub OAuth
- [x] Bookmarks and watch history (cross-device)
- [x] Edge-cached TMDb responses
- [x] 6-provider stream fallback chain
- [ ] Watch Party with LiveKit WebRTC *(in progress)*
- [ ] Real-time chat in Watch Party
- [ ] Host sync controls (play/pause/seek broadcast)
- [ ] Rate limiting per IP (Upstash Ratelimit)
- [ ] User reviews and ratings
- [ ] Cloudflare Worker ad-stripping proxy

---

## Contributing

Pull requests are welcome. For major changes, open an issue first.

```bash
# Create a feature branch
git checkout -b feature/your-feature

# Commit changes
git commit -m "feat: your feature"

# Push and open a PR
git push origin feature/your-feature
```

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built by [Kartik Lande](https://kartik70.dev) · [kartiklande70@gmail.com](mailto:kartiklande70@gmail.com)

[![Portfolio](https://img.shields.io/badge/Portfolio-kartik70.dev-black?style=flat-square&logo=vercel)](https://kartik70.dev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-kartik--lande-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/kartik-lande-b2b2b1204/)
[![GitHub](https://img.shields.io/badge/GitHub-lande26-181717?style=flat-square&logo=github)](https://github.com/lande26)

</div>
