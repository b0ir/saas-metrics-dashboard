import { KPICard } from '@/components/KPICard'
import type { KPIResult } from '@/hooks/useMetrics'

interface KPIGridProps {
  kpis: KPIResult[]
}

export function KPIGrid({ kpis }: KPIGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {kpis.map((kpi) => (
        <KPICard key={kpi.key} kpi={kpi} />
      ))}
    </div>
  )
}
