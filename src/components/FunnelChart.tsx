import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { aggregate } from '@/lib/metrics'
import type { DayRecord } from '@/types/metrics'
import { FUNNEL_STEPS } from '@/types/metrics'

const STEP_LABELS: Record<string, string> = {
  traffic: 'Visits',
  leads_created: 'Leads',
  leads_qualified: 'Qualified',
  deals_created: 'Deals',
  deals_won: 'Won',
}

const BAR_COLOR = '#0e7490'

interface FunnelChartProps {
  filtered: DayRecord[]
}

export function FunnelChart({ filtered }: FunnelChartProps) {
  const chartData = FUNNEL_STEPS.map((key) => ({
    name: STEP_LABELS[key],
    value: aggregate(filtered, key) ?? 0,
  }))

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold text-slate-700">
          Sales Funnel
        </CardTitle>
        <p className="text-xs text-slate-400">Conversions across selected period</p>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 24, left: 8, bottom: 0 }}
          >
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={72}
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v: number) => [v.toLocaleString(), 'Total']}
              contentStyle={{
                fontSize: 12,
                border: '1px solid #e2e8f0',
                borderRadius: 8,
              }}
              cursor={{ fill: '#f1f5f9' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={22}>
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={BAR_COLOR}
                  fillOpacity={1 - i * 0.12}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
