# Architecture

## Stack

- **Web:** Next.js 16 App Router, React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Backend:** Supabase Postgres
- **Auth:** Supabase Auth via `@supabase/ssr`
- **Security:** Row Level Security for user-owned data; service role reserved for catalog administration/imports
- **CI:** GitHub Actions

## Application boundaries

### Catalog domain

Brands, shoes, use cases, source provenance. Catalog records are administrator-controlled; users do not directly mutate canonical shoe specifications.

### Community domain

Runner profiles, reviews, perception dimensions and helpful votes. Users own and mutate only their own contributions.

### Collection domain

Current shoes, past shoes, race shoes and wishlist. This is both a retention feature and a source of future preference signals.

### Commerce domain

Retailers and observed prices are separated from canonical shoe data. This lets price freshness evolve independently and makes sponsored/affiliate logic auditable.

## Data flow

```text
manufacturer / admin source
        ↓
 canonical shoe catalog ← retailer price observations
        ↓
 shoe page / compare
        ↑
 structured review ← runner profile
        ↓
 community aggregates
        ↓
 future similarity + recommendation models
```

## Recommendation evolution

V0: transparent rules/heuristics for prototype UX only.

V1: SQL cohort queries: runners with similar weight, pace, mileage, foot width and goal.

V2: learned embeddings or ranking model using runner × shoe interactions, with explainable cohort evidence retained in product UI.

AI should query Runned's proprietary structured data; it should not replace the data layer.
