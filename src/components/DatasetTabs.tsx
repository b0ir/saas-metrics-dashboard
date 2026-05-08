import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { DatasetKey } from '@/types/metrics'
import { DATASET_KEYS } from '@/types/metrics'

interface DatasetTabsProps {
  active: DatasetKey
  onSelect: (key: DatasetKey) => void
}

export function DatasetTabs({ active, onSelect }: DatasetTabsProps) {
  return (
    <Tabs value={active} onValueChange={(v) => onSelect(v as DatasetKey)}>
      <TabsList className="bg-slate-100 border border-slate-200">
        {DATASET_KEYS.map((key) => (
          <TabsTrigger
            key={key}
            value={key}
            className="data-[state=active]:bg-accent data-[state=active]:text-white px-5"
          >
            Dataset {key}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
