# Akispa

Monorepo for the Akispa spa booking platform. Trunk-based: all work lands on `main`.

| Path | What | Stack | Status |
| --- | --- | --- | --- |
| `apps/web` | Public, SEO-ready booking site | Next.js 16 + Tailwind 4 | ✅ frontend design |
| `apps/admin` | Booking management portal (mobile responsive) | Next.js + Tailwind | planned |
| `services/api` | Booking API | Go + Iris, MySQL | planned |

## Getting started

```bash
pnpm install
pnpm dev:web          # http://localhost:3000
```

Copy `apps/web/.env.example` to `apps/web/.env.local` to configure the site URL and API URL.
Without `NEXT_PUBLIC_API_URL`, checkout runs against an in-browser demo stub.

## Deferred decisions
Payment gateway, email provider, Cloudflare DNS, Jaeger tracing and the Alibaba Cloud move are TBC.
