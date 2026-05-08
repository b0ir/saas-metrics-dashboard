import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { DayRecord, MetricDef, MetricKey } from '@/types/metrics'
import { METRIC_LABELS, METRIC_DESCRIPTIONS } from '@/lib/labels'

interface TimeSeriesChartProps {
  filtered: DayRecord[]
  metrics: MetricDef[]
  datasetColor: string
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-CL', { month: 'short', day: 'numeric' })
}

export function TimeSeriesChart({ filtered, metrics, datasetColor }: TimeSeriesChartProps) {
  const [selectedKey, setSelectedKey] = useState<MetricKey>(metrics[0]?.key ?? 'traffic')

  const selectedDef = metrics.find((m) => m.key === selectedKey)

  const chartData = filtered.map((day) => ({
    date: formatDate(day.date),
    value: day.metrics[selectedKey as keyof typeof day.metrics],
  }))

  // Calculate Y-axis domain with 10% padding
  const values = chartData.map((d) => d.value).filter((v): v is number => v !== null)
  const min = values.length ? Math.min(...values) : 0
  const max = values.length ? Math.max(...values) : 100
  const pad = (max - min) * 0.1 || 10
  const domain: [number, number] = [Math.max(0, min - pad), max + pad]

  // Reduce tick density for large ranges
  const tickCount = filtered.length > 60 ? 6 : filtered.length > 30 ? 8 : filtered.length

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-700">
              Tendencia en el tiempo
            </CardTitle>
            {selectedDef && (
              <p className="text-xs text-slate-400 mt-0.5">
                {METRIC_DESCRIPTIONS[selectedDef.key] ?? selectedDef.description}
              </p>
            )}
          </div>
          <Select value={selectedKey} onValueChange={(v) => setSelectedKey(v as MetricKey)}>
            <SelectTrigger className="w-48 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {metrics.map((m) => (
                <SelectItem key={m.key} value={m.key} className="text-xs">
                  {METRIC_LABELS[m.key] ?? m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={chartData}
            margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              interval={Math.floor(filtered.length / tickCount)}
            />
            <YAxis
              domain={domain}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              formatter={(v) => [
                v != null ? Number(v).toLocaleString() : 'N/A',
                selectedDef?.unit ?? '',
              ]}
              contentStyle={{
                fontSize: 12,
                border: '1px solid #e2e8f0',
                borderRadius: 8,
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={datasetColor}
              strokeWidth={2}
              dot={false}
              connectNulls={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
