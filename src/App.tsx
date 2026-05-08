import './index.css'
import { useDataset } from '@/hooks/useDataset'
import { useMetrics } from '@/hooks/useMetrics'
import { DatasetTabs } from '@/components/DatasetTabs'
import { DateRangeFilter } from '@/components/DateRangeFilter'
import { KPIGrid } from '@/components/KPIGrid'
import { FunnelChart } from '@/components/FunnelChart'
import { TimeSeriesChart } from '@/components/TimeSeriesChart'

const DATASET_COLORS: Record<string, string> = {
  A: '#0e7490',
  B: '#059669',
  C: '#7c3aed',
  D: '#d97706',
}

export default function App() {
  const { dataset, activeKey, setActiveKey, dateRange, setDateRange } = useDataset()
  const { filtered, kpis } = useMetrics(dataset, dateRange)

  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 leading-tight">
              Executive Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {dataset.metadata.start_date} → {dataset.metadata.end_date}
            </p>
          </div>
          <DatasetTabs active={activeKey} onSelect={setActiveKey} />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Date filter */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-600">
            Dataset {activeKey} —{' '}
            <span className="text-slate-400 font-normal">
              {filtered.length} days selected
            </span>
          </h2>
          <DateRangeFilter active={dateRange} onChange={setDateRange} />
        </div>

        {/* KPI cards */}
        <KPIGrid kpis={kpis} />

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FunnelChart filtered={filtered} />
          <TimeSeriesChart
            filtered={filtered}
            metrics={dataset.metadata.metrics}
            datasetColor={DATASET_COLORS[activeKey]}
          />
        </div>
      </main>
    </div>
  )
}
