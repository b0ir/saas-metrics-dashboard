import { useMemo } from 'react'
import type { Dataset, DateRange, MetricKey } from '@/types/metrics'
import { filterByDays, aggregate, trendDelta, directionColor } from '@/lib/metrics'
import { METRIC_LABELS, UNIT_LABELS } from '@/lib/labels'

export interface KPIResult {
  key: MetricKey
  label: string
  unit: string
  direction: 'higher_is_better' | 'lower_is_better'
  description: string
  value: number | null
  delta: number | null
  trend: 'good' | 'bad' | 'neutral'
  deltaLabel: string
}

export function useMetrics(dataset: Dataset, dateRange: DateRange) {
  const filtered = useMemo(
    () => filterByDays(dataset.days, dateRange),
    [dataset, dateRange],
  )

  const kpis: KPIResult[] = useMemo(() => {
    const deltaLabel = dateRange === 365
      ? 'sin año anterior'
      : `vs ${dateRange}d anteriores`

    return dataset.metadata.metrics.map((def) => {
      const value = aggregate(filtered, def.key)
      const delta = trendDelta(dataset.days, def.key, dateRange)
      const trend = directionColor(delta, def.direction)
      return {
        ...def,
        label: METRIC_LABELS[def.key] ?? def.label,
        unit: UNIT_LABELS[def.unit] ?? def.unit,
        value,
        delta,
        trend,
        deltaLabel,
      }
    })
  }, [filtered, dataset, dateRange])

  return { filtered, kpis }
}
