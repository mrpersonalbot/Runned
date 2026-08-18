# Runned

**The running shoe database built by runners.**

Runned is an Indonesia-first running-shoe intelligence platform. It combines manufacturer specifications with structured runner perception, runner profiles, shoe rotations, comparisons, and eventually local retailer pricing.

## Product thesis

Most running-shoe information is fragmented between brand pages, creators, marketplace reviews, and conversations. Runned turns subjective experience into structured data and keeps it connected to the runner behind the review.

The long-term moat is the **runner × shoe × experience preference graph**, not editorial content alone.

## Foundation included

- Next.js 16 App Router + TypeScript + Tailwind CSS 4
- Responsive product foundation UI
- Canonical shoe pages
- Structured community-perception prototype
- Shoe comparison experience
- Indonesia-first brand architecture
- Supabase SSR/auth wiring for Google + email/password
- PostgreSQL/Supabase migration with RLS
- Catalog seed with verified source metadata separated from demo community data
- User profiles, runner profiles, reviews, review votes, rotations/wishlists, retailers and prices
- Pure unit tests for formatting/confidence/match prototype logic
- GitHub Actions CI for tests, lint, typecheck and production build
- Product, architecture, data-model and roadmap docs

## Important data rule

`src/lib/data/demo-shoes.ts` contains **synthetic community scores solely to demonstrate the interface**. They must never be presented as real Runned community data. Production community aggregates come from `public.reviews`.

Manufacturer specifications use `source_status` and source metadata. Unverified catalog entries remain nullable rather than inventing specifications.

## Local setup

Requirements: Node.js 20.9+ (Node 22 recommended) and a Supabase project.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then configure:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Apply `supabase/migrations/0001_initial_schema.sql` and optionally `supabase/seed.sql` through the Supabase CLI or SQL editor.

For Google login, enable Google under Supabase Auth providers and add the app callback URL:

```text
http://localhost:3000/auth/callback
```

## Validation

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

The repository intentionally uses `npm install` in CI until a dependency lockfile is generated from a network-connected environment and committed. Once `package-lock.json` exists, switch CI to `npm ci`.

## Product principles

1. One canonical URL per shoe.
2. Objective manufacturer specs and subjective community perception are never mixed.
3. A review is only useful when its runner context is preserved.
4. Local Indonesian brands are first-class catalog citizens.
5. Community trust comes before affiliate monetization.
6. Missing data stays missing; Runned never fabricates specs.

See `docs/` for the product specification and technical design.
