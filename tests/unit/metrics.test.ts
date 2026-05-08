import { describe, it, expect } from 'vitest'
import {
  filterByDays,
  aggregate,
  trendDelta,
  directionColor,
  formatValue,
  formatDelta,
} from '@/lib/metrics'
import type { DayRecord } from '@/types/metrics'

function makeDay(date: string, traffic: number | null, avg_response_time_min: number | null = 30): DayRecord {
  return {
    date,
    metrics: {
      traffic,
      leads_created: 5,
      leads_qualified: 3,
      deals_created: 2,
      deals_won: 1,
      deals_lost: 1,
      avg_response_time_min,
      avg_deal_cycle_days: 20,
      stale_deals: 10,
      support_tickets_opened: 4,
      support_avg_resolution_hours: 6,
    },
  }
}

const days30 = Array.from({ length: 30 }, (_, i) =>
  makeDay(`2025-${String(i + 1).padStart(2, '0')}-01`, 100 + i),
)

describe('filterByDays', () => {
  it('returns last N records', () => {
    const result = filterByDays(days30, 7)
    expect(result).toHaveLength(7)
    expect(result[0]).toBe(days30[23])
  })

  it('returns all records when N >= length', () => {
    expect(filterByDays(days30, 365)).toHaveLength(30)
  })
})

describe('aggregate', () => {
  it('sums count metrics (traffic)', () => {
    const records = [makeDay('d1', 100), makeDay('d2', 200)]
    expect(aggregate(records, 'traffic')).toBe(300)
  })

  it('averages rate metrics (avg_response_time_min)', () => {
    const records = [
      makeDay('d1', 100, 40),
      makeDay('d2', 100, 60),
    ]
    expect(aggregate(records, 'avg_response_time_min')).toBe(50)
  })

  it('excludes null values', () => {
    const records = [makeDay('d1', null), makeDay('d2', 200)]
    expect(aggregate(records, 'traffic')).toBe(200)
  })

  it('returns null when all values are null', () => {
    const records = [makeDay('d1', null), makeDay('d2', null)]
    expect(aggregate(records, 'traffic')).toBeNull()
  })
})

describe('trendDelta', () => {
  it('returns null when records fewer than 2× days', () => {
    expect(trendDelta(days30.slice(0, 13), 'traffic', 7)).toBeNull()
    expect(trendDelta(days30, 'traffic', 90)).toBeNull()
  })

  it('returns positive delta when recent avg > previous avg', () => {
    const delta = trendDelta(days30, 'traffic', 7)
    expect(delta).not.toBeNull()
    expect(delta!).toBeGreaterThan(0)
  })

  it('returns null when baseline is zero', () => {
    const records = Array.from({ length: 14 }, (_, i) =>
      makeDay(`d${i}`, i < 7 ? 0 : 100),
    )
    expect(trendDelta(records, 'traffic', 7)).toBeNull()
  })
})

describe('directionColor', () => {
  it('positive delta + higher_is_better → good', () => {
    expect(directionColor(5, 'higher_is_better')).toBe('good')
  })

  it('negative delta + higher_is_better → bad', () => {
    expect(directionColor(-5, 'higher_is_better')).toBe('bad')
  })

  it('positive delta + lower_is_better → bad', () => {
    expect(directionColor(5, 'lower_is_better')).toBe('bad')
  })

  it('negative delta + lower_is_better → good', () => {
    expect(directionColor(-5, 'lower_is_better')).toBe('good')
  })

  it('null delta → neutral', () => {
    expect(directionColor(null, 'higher_is_better')).toBe('neutral')
  })

  it('near-zero delta (< 0.1) → neutral', () => {
    expect(directionColor(0.05, 'higher_is_better')).toBe('neutral')
  })
})

describe('formatValue', () => {
  it('formats integer without decimal', () => {
    expect(formatValue(100, 'visits')).toBe('100 visits')
  })

  it('rounds float to 1 decimal', () => {
    expect(formatValue(34.567, 'min')).toBe('34,6 min')
  })

  it('returns N/A for null', () => {
    expect(formatValue(null, 'visits')).toBe('N/A')
  })
})

describe('formatDelta', () => {
  it('shows + sign for positive', () => {
    expect(formatDelta(4.2)).toBe('+4.2%')
  })

  it('shows - sign for negative', () => {
    expect(formatDelta(-3.1)).toBe('-3.1%')
  })

  it('returns — for null', () => {
    expect(formatDelta(null)).toBe('—')
  })
})
