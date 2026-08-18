# Contributing to Runned

## Development rules

1. Preserve the distinction between objective specs and community perception.
2. Do not add manufacturer specifications without provenance.
3. Never represent synthetic fixture ratings as real community data.
4. Database changes require a forward-only migration and RLS review.
5. User-owned writes must be protected by RLS, not client-side checks alone.
6. Add or update tests for pure recommendation/formatting logic.

## Branches and commits

Use focused feature branches and small, reviewable commits. Pull requests should explain product impact, data-model impact and validation performed.

## Before opening a PR

```bash
npm test
npm run lint
npm run typecheck
npm run build
```
