# CLAUDE.md

## Project

Executive B2B SaaS metrics dashboard. React + TypeScript + Vite. Data source: `src/data/metrics.json` (4 datasets × 365 days × 11 metrics).

## Dev commands

```bash
npm run dev          # dev server at localhost:5173
npm test             # vitest unit + component tests with coverage
npm run test:e2e     # playwright e2e (requires dev server or uses webServer config)
npm run build        # tsc + vite build (production)
npm run lint         # eslint
```

## Architecture

```
src/
  data/metrics.json     # static import — 652KB, 4 datasets (A/B/C/D)
  types/metrics.ts      # all shared types: MetricKey, MetricDef, DayRecord, Dataset, etc.
  lib/metrics.ts        # pure functions: filterByDays, aggregate, trendDelta, directionColor
  hooks/
    useDataset.ts       # selected dataset key + date range state
    useMetrics.ts       # derives kpis[] and filtered days from dataset + range
  components/
    KPICard.tsx         # single metric card — direction-aware trend colors, N/A for null
    KPIGrid.tsx         # 11-card grid
    FunnelChart.tsx     # traffic → leads → qualified → deals → won (Recharts horizontal bar)
    TimeSeriesChart.tsx # line chart with metric selector (Recharts)
    DatasetTabs.tsx     # A/B/C/D tab switcher
    DateRangeFilter.tsx # 30/90/365 day presets
    ui/                 # shadcn/ui primitives — do not edit directly
```

## Color tokens (defined in src/index.css @theme)

| Token | Value | Usage |
|---|---|---|
| `--color-accent` | `#0e7490` | Active tabs, buttons, primary chart stroke |
| `--color-trend-good` | `#059669` | Positive trend (direction-aware) |
| `--color-trend-bad` | `#dc2626` | Negative trend (direction-aware) |
| `--color-page` | `#f1f5f9` | App background |
| `--color-border` | `#e2e8f0` | Card borders |

Dataset strokes: A=`#0e7490`, B=`#059669`, C=`#7c3aed`, D=`#d97706`

## Key invariants

- **Direction logic lives only in `lib/metrics.ts:directionColor`** — never inline it in components.
- **Null safety**: `aggregate()` returns `null` when all values in range are null. KPICard renders `<Badge>N/A</Badge>` — never crashes.
- **Sum vs average**: count metrics (traffic, leads, deals, stale_deals, tickets) are summed; rate/duration metrics (avg_response_time_min, avg_deal_cycle_days, support_avg_resolution_hours) are averaged.
- **Test scope**: vitest runs `tests/unit/**` only. E2E lives in `tests/e2e/` and runs via `npx playwright test`.

## Commit convention

Conventional Commits: `feat:`, `fix:`, `chore:`, `test:`, `docs:`, `style:`, `refactor:`, `ci:`
