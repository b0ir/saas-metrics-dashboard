import { useMemo } from 'react'
import type { Dataset, DateRange, MetricKey } from '@/types/metrics'
import { filterByDays, aggregate, trendDelta, directionColor } from '@/lib/metrics'

export interface KPIResult {
  key: MetricKey
  label: string
  unit: string
  direction: 'higher_is_better' | 'lower_is_better'
  description: string
  value: number | null
  delta: number | null
  trend: 'good' | 'bad' | 'neutral'
}

export function useMetrics(dataset: Dataset, dateRange: DateRange) {
  const filtered = useMemo(
    () => filterByDays(dataset.days, dateRange),
    [dataset, dateRange],
  )

  const kpis: KPIResult[] = useMemo(
    () =>
      dataset.metadata.metrics.map((def) => {
        const value = aggregate(filtered, def.key)
        const delta = trendDelta(filtered, def.key)
        const trend = directionColor(delta, def.direction)
        return { ...def, value, delta, trend }
      }),
    [filtered, dataset.metadata.metrics],
  )

  return { filtered, kpis }
}
