export type Direction = 'higher_is_better' | 'lower_is_better'

export type DatasetKey = 'A' | 'B' | 'C' | 'D'

export type MetricKey =
  | 'traffic'
  | 'leads_created'
  | 'leads_qualified'
  | 'deals_created'
  | 'deals_won'
  | 'deals_lost'
  | 'avg_response_time_min'
  | 'avg_deal_cycle_days'
  | 'stale_deals'
  | 'support_tickets_opened'
  | 'support_avg_resolution_hours'

export interface MetricDef {
  key: MetricKey
  label: string
  unit: string
  direction: Direction
  description: string
}

export interface DayRecord {
  date: string
  metrics: Record<MetricKey, number | null>
}

export interface DatasetMetadata {
  start_date: string
  end_date: string
  days: number
  metrics: MetricDef[]
}

export interface Dataset {
  metadata: DatasetMetadata
  days: DayRecord[]
}

export type MetricsData = Record<DatasetKey, Dataset>

export const DATASET_KEYS: DatasetKey[] = ['A', 'B', 'C', 'D']

export const DATE_RANGES = [30, 90, 365] as const
export type DateRange = (typeof DATE_RANGES)[number]

/** Metrics that should be summed across a period (counts) */
export const SUM_METRICS: MetricKey[] = [
  'traffic',
  'leads_created',
  'leads_qualified',
  'deals_created',
  'deals_won',
  'deals_lost',
  'stale_deals',
  'support_tickets_opened',
]

/** Metrics that should be averaged across a period (rates/durations) */
export const AVG_METRICS: MetricKey[] = [
  'avg_response_time_min',
  'avg_deal_cycle_days',
  'support_avg_resolution_hours',
]

/** Funnel steps in order */
export const FUNNEL_STEPS: MetricKey[] = [
  'traffic',
  'leads_created',
  'leads_qualified',
  'deals_created',
  'deals_won',
]
