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

**Browse. Stream. Watch Together (Perfectly Synced).**

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

The stack is designed around real distributed systems principles: edge caching, serverless connection pooling, **WebRTC Screen Sharing (Theater Mode)** for perfect synchronization, and a recursive **Cloudflare Ad-Proxy** for a clean, uninterrupted viewing experience. Everything runs at **$0/month**.

---

## Features

- 🎬 &nbsp;**Browse & Stream** — 500,000+ movies and TV shows via TMDb API with ratings, cast, and recommendations.
- 🔐 &nbsp;**Premium Auth Guarding** — Seamless sign-in popups for guest users trying to access Watch Party, Bookmarks, or History.
- 🔖 &nbsp;**Bookmarks & Watch History** — Synced to Neon Postgres, accessible on any device.
- 🎉 &nbsp;**Screen-Shared Watch Party** — Perfect synchronization via **WebRTC Screen Sharing** and a dedicated **Theater Mode** to prevent recursion.
- 💬 &nbsp;**Real-time Chat** — Built into Watch Party via LiveKit Data Channels.
- 🛡️ &nbsp;**Cloudflare Ad-Proxy** — Recursive edge worker that strips malicious ads and popups from streaming providers.
- ⚡ &nbsp;**Edge-cached responses** — TMDb API calls cached in Upstash Redis, sub-10ms cache hits.
- 🔁 &nbsp;**Stream Fallback Chain** — 9+ providers with circuit breaker, never breaks mid-watch.
- 🌙 &nbsp;**Dark Theme** — Clean, aesthetic UI with Framer Motion animations and responsive layout.

---

## Architecture

Landemon is split into five distinct layers, each independently scalable:

```
┌─────────────┐    ┌──────────────────┐    ┌─────────────────────────────────┐
│   Client    │───▶│   Edge / Proxy   │───▶│        Compute (Vercel)         │
│             │    │                  │    │                                 │
│  Browser /  │    │ Cloudflare Worker│    │  Next.js 15 App Router          │
│  Next.js    │    │ (Ad-Mitigation)  │    │  middleware.ts (auth guard)     │
│             │    │ Vercel ISR / CDN │    │  /api/movies/* (TMDb + cache)   │
└─────────────┘    └──────────────────┘    │  /api/stream/[tmdbId] (chain)  │
                                           │  /api/livekit (WebRTC token)   │
                                           └───────────────┬─────────────────┘
                                                           │
                          ┌────────────────────────────────┼─────────────────────┐
                          │                                │                     │
                   ┌──────▼──────┐                ┌───────▼──────┐    ┌─────────▼───────┐
                   │ Data Layer  │                │   LiveKit    │    │ Stream Providers│
                   │             │                │  (WebRTC)    │    │                 │
                   │ Neon PG     │                │ Screen Share │    │ vidsrc.cc (Proxied)
                   │ Upstash     │                │ + Video/Mic  │    │ vidsrc.xyz      │
                   │ Redis       │                │ + Data Chat  │    │ vidlink.pro     │
                   │ Prisma ORM  │                └──────────────┘    │ smashystream    │
                   └─────────────┘                                    │ 5+ others ↓     │
                                                                      └─────────────────┘
```

### Key Design Decisions

| Decision | Why |
|---|---|
| WebRTC Screen Sharing | Replaces fragile sync models. Host broadcasts their screen directly to guests for frame-perfect sync. |
| Cloudflare Ad-Proxy | A recursive worker that intercepts 3rd-party frames, stripping ads and popups before they reach the user. |
| Theater Mode | A minimal, dedicated window for the Host to share, preventing the "infinity mirror" effect during screen sharing. |
| Upstash Redis for caching | Serverless, pay-per-request, globally replicated — no idle cost. |
| 9-provider fallback chain | Any single provider can go down — the chain ensures playback never breaks. |

---

## Tech Stack
