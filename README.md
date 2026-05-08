# SaaS Metrics Dashboard

Dashboard ejecutivo para métricas B2B SaaS. Visualiza tráfico, pipeline de ventas y soporte técnico desde un dataset JSON con 365 días de datos históricos organizados en 4 escenarios (A, B, C, D).

[![CI](https://github.com/b0ir/saas-metrics-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/b0ir/saas-metrics-dashboard/actions/workflows/ci.yml)

---

## Setup

```bash
npm install
npm run dev        # localhost:5173
npm test           # unit tests + coverage
npm run test:e2e   # playwright e2e
npm run build      # production build
```

**Requisitos:** Node 20+

---

## Decisiones técnicas

### Build tool: Vite
SPA estática con datos importados en build time. No hay server-side rendering ni fetching asíncrono, así que Next.js habría sido sobredimensionado. Vite arranca en menos de 500ms y el bundle final es predecible.

### UI: Tailwind CSS v4 + shadcn/ui
Tailwind para utilidades, shadcn/ui para los primitivos accesibles (Tabs, Select, Button, Badge, Card). El setup es mínimo y las decisiones de diseño quedan explícitas en el markup, no escondidas en un componente de librería con 40 props.

### Charts: Recharts
React-native, composable, tipado con TypeScript. Para un dashboard ejecutivo donde los datos son relativamente simples (líneas, barras horizontales), Recharts es suficiente sin agregar complejidad innecesaria.

### Estado: useState sin librería externa
No hay datos asincrónicos ni cache invalidation. Todo el estado es local: dataset seleccionado (A/B/C/D) y rango de fechas (30/90/365 días). Agregar Zustand o TanStack Query habría sido ingeniería de más para este scope.

### Lógica de métricas: funciones puras en `src/lib/metrics.ts`
La dirección (`higher_is_better` / `lower_is_better`) determina si un delta positivo es bueno o malo. Esta lógica está separada de los componentes y es lo primero que se testea. Métricas de conteo (tráfico, leads, deals) se suman; métricas de tasa (tiempo de respuesta, ciclo de deal) se promedian.

### Valores nulos
Cuando una métrica es null para todos los días del período seleccionado, el KPI card muestra un badge "N/A". Los nulos se excluyen de agregaciones y deltas sin romper el render.

---

## Testing

| Suite | Herramienta | Qué cubre |
|---|---|---|
| Funciones puras | Vitest | `filterByDays`, `aggregate`, `trendDelta`, `directionColor`, `formatValue` |
| Componentes | Vitest + RTL | `KPICard` (null, delta, dirección), `DatasetTabs` (selección) |
| Flujos críticos | Playwright | Dataset switching, filtros de fecha, manejo de nulos en todos los escenarios |
| CI | GitHub Actions | Corre en cada push a `main` |

Cobertura: **~98% statements en `src/lib/`** (lógica crítica). Componentes visuales cubiertos por E2E.

---

## Segunda iteración

- **Lazy loading del JSON por dataset**: importar `metrics.json` estáticamente genera un chunk de ~1MB. En producción conviene hacer fetch por dataset o transformar el JSON en build time.
- **Comparación de datasets**: mostrar A vs B en el mismo gráfico sería el siguiente feature natural para el VP de ventas.
- **Tests de accesibilidad con axe-playwright**: los primitivos de shadcn son accesibles, pero falta validarlo en los flujos críticos de forma automatizada.
- **Query params para estado compartible**: `?dataset=B&range=90` permite compartir una vista específica por link.

---

## IA utilizada

Proyecto acelerado con Claude Code (Anthropic). Las decisiones de arquitectura, lógica de métricas y estructura de tests fueron definidas antes de generar código. Los tests se escribieron junto con la implementación.
