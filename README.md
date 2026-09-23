# CFSL Website

Website for the Chess Federation of Sri Lanka: Next.js (App Router) + shadcn/ui + Payload 3, on Neon Postgres and Vercel Blob. See [docs/architecture.md](docs/architecture.md).

## Local development

```bash
cp .env.example .env   # set DATABASE_URL and PAYLOAD_SECRET
pnpm install
pnpm migrate
SEED_ADMINS="you@example.com:password" pnpm seed:admins
pnpm dev
```

Site: http://localhost:3000 · Admin: http://localhost:3000/admin

## Schema changes

Dev-mode schema push is disabled. After changing a collection or global:

```bash
pnpm payload migrate:create <name>
pnpm generate:types
```

Commit the generated files in `src/migrations/`. Deployments run `payload migrate` before `next build`.
