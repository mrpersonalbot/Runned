# Data Model

The schema is deliberately normalized around the unit of value: **a runner experiencing a specific shoe**.

## Core entities

- `brands`: canonical manufacturer identity.
- `shoes`: canonical shoe record and objective specifications.
- `shoe_use_cases`: many-to-many intent taxonomy.
- `profiles`: public/account identity extension of Supabase Auth.
- `runner_profiles`: performance/body/foot context used for cohort analysis.
- `reviews`: one structured experience per runner per shoe.
- `review_votes`: community quality signal.
- `user_shoes`: rotation/history/wishlist relationship.
- `retailers`: Indonesian seller identity.
- `shoe_prices`: timestamped price observations.
- `shoe_community_summary`: aggregate view for efficient product pages.

## Why perception fields are columns

The first ten review dimensions are stable, product-critical metrics. Explicit columns make constraints, analytics, cohort queries and materialized aggregates straightforward. If experimental dimensions proliferate later, add a versioned secondary response table rather than making the MVP schema fully EAV/JSON.

## Privacy boundary

Runner profile attributes are sensitive contextual data. The base migration only allows users to select their own raw runner profile. Public shoe pages should use aggregated/anonymized cohorts rather than exposing individual body/performance attributes.
