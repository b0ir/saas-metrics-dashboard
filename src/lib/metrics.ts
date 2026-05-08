import type { DayRecord, Direction, MetricKey } from '@/types/metrics'
import { SUM_METRICS } from '@/types/metrics'

/** Returns last `days` records from a dataset's day array */
export function filterByDays(records: DayRecord[], days: number): DayRecord[] {
  return records.slice(-days)
}

/**
 * Aggregates a metric across a set of day records.
 * Count-type metrics are summed; rate/duration metrics are averaged.
 * Null values are excluded from both operations.
 */
export function aggregate(records: DayRecord[], key: MetricKey): number | null {
  const values = records
    .map((d) => d.metrics[key])
    .filter((v): v is number => v !== null)

  if (values.length === 0) return null

  if (SUM_METRICS.includes(key)) {
    return values.reduce((a, b) => a + b, 0)
  }
  return values.reduce((a, b) => a + b, 0) / values.length
}

/**
 * Computes percentage delta between the last 7 days and the 7 days before.
 * Returns null when there is insufficient data or a zero baseline.
 */
export function trendDelta(records: DayRecord[], key: MetricKey, days: number): number | null {
  if (records.length < days * 2) return null

  const recent = records.slice(-days)
  const previous = records.slice(-days * 2, -days)

  const recentAvg = averageNonNull(recent.map((d) => d.metrics[key]))
  const prevAvg = averageNonNull(previous.map((d) => d.metrics[key]))

  if (recentAvg === null || prevAvg === null || prevAvg === 0) return null

  return ((recentAvg - prevAvg) / prevAvg) * 100
}

/** Returns the CSS color class token for a trend given metric direction */
export function directionColor(
  delta: number | null,
  direction: Direction,
): 'good' | 'bad' | 'neutral' {
  if (delta === null || Math.abs(delta) < 0.1) return 'neutral'
  const isUp = delta > 0
  if (direction === 'higher_is_better') return isUp ? 'good' : 'bad'
  return isUp ? 'bad' : 'good'
}

/** Formats a number for display: rounds floats to 1 decimal, keeps integers whole */
export function formatValue(value: number | null, unit: string): string {
  if (value === null) return 'N/A'
  const rounded = Number.isInteger(value) ? value : +value.toFixed(1)
  return `${rounded.toLocaleString('es-CL')} ${unit}`
}

/** Formats a delta as "+4.2%" or "-3.1%" */
export function formatDelta(delta: number | null): string {
  if (delta === null) return '—'
  const sign = delta >= 0 ? '+' : ''
  return `${sign}${delta.toFixed(1)}%`
}

function averageNonNull(values: (number | null)[]): number | null {
  const nums = values.filter((v): v is number => v !== null)
  if (nums.length === 0) return null
  return nums.reduce((a, b) => a + b, 0) / nums.length
}
