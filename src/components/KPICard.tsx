import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatValue, formatDelta } from '@/lib/metrics'
import type { KPIResult } from '@/hooks/useMetrics'
import { cn } from '@/lib/utils'

interface KPICardProps {
  kpi: KPIResult
}

const trendStyles = {
  good: 'text-emerald-600',
  bad: 'text-red-600',
  neutral: 'text-slate-400',
} as const

const TrendIcon = ({ trend }: { trend: KPIResult['trend'] }) => {
  if (trend === 'good') return <TrendingUp className="h-3.5 w-3.5" />
  if (trend === 'bad') return <TrendingDown className="h-3.5 w-3.5" />
  return <Minus className="h-3.5 w-3.5" />
}

export function KPICard({ kpi }: KPICardProps) {
  const isNull = kpi.value === null

  return (
    <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {kpi.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {isNull ? (
          <Badge variant="secondary" className="text-sm">
            N/A
          </Badge>
        ) : (
          <p className="text-2xl font-semibold text-slate-900 tabular-nums">
            {formatValue(kpi.value, kpi.unit)}
          </p>
        )}
        <div
          className={cn(
            'mt-1.5 flex items-center gap-1 text-xs font-medium',
            trendStyles[kpi.trend],
          )}
          data-trend={kpi.trend}
        >
          <TrendIcon trend={kpi.trend} />
          <span>{formatDelta(kpi.delta)}</span>
          <span className="text-slate-400 font-normal">vs prev 7d</span>
        </div>
      </CardContent>
    </Card>
  )
}
