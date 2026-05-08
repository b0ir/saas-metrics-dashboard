import { useState } from 'react'
import type { DatasetKey, DateRange } from '@/types/metrics'
import { DATASET_KEYS } from '@/types/metrics'
import metricsData from '@/data/metrics.json'
import type { MetricsData } from '@/types/metrics'

const data = metricsData as unknown as MetricsData

export function useDataset() {
  const [activeKey, setActiveKey] = useState<DatasetKey>('A')
  const [dateRange, setDateRange] = useState<DateRange>(90)

  const dataset = data[activeKey]

  return {
    data,
    dataset,
    activeKey,
    setActiveKey,
    dateRange,
    setDateRange,
    allKeys: DATASET_KEYS,
  }
}
