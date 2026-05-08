import { Button } from '@/components/ui/button'
import type { DateRange } from '@/types/metrics'
import { DATE_RANGES } from '@/types/metrics'
import { cn } from '@/lib/utils'

const LABELS: Record<DateRange, string> = {
  30: '30 días',
  90: '90 días',
  365: '1 año',
}

interface DateRangeFilterProps {
  active: DateRange
  onChange: (range: DateRange) => void
}

export function DateRangeFilter({ active, onChange }: DateRangeFilterProps) {
  return (
    <div className="flex gap-1.5" role="group" aria-label="Rango de fechas">
      {DATE_RANGES.map((range) => (
        <Button
          key={range}
          variant={active === range ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(range)}
          className={cn(
            'text-xs h-8 px-3',
            active === range
              ? 'bg-accent hover:bg-accent/90 text-white border-accent'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50',
          )}
          data-testid={`range-${range}`}
        >
          {LABELS[range]}
        </Button>
      ))}
    </div>
  )
}
