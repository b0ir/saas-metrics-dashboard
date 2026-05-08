import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KPICard } from '@/components/KPICard'
import type { KPIResult } from '@/hooks/useMetrics'

function makeKPI(overrides: Partial<KPIResult> = {}): KPIResult {
  return {
    key: 'traffic',
    label: 'Daily visits',
    unit: 'visits',
    direction: 'higher_is_better',
    description: 'Unique visits',
    value: 1234,
    delta: 5.2,
    trend: 'good',
    ...overrides,
  }
}

describe('KPICard', () => {
  it('renders the metric label', () => {
    render(<KPICard kpi={makeKPI()} />)
    expect(screen.getByText('Daily visits')).toBeInTheDocument()
  })

  it('renders the formatted value with unit', () => {
    render(<KPICard kpi={makeKPI({ value: 1234 })} />)
    expect(screen.getByText(/1,234 visits/)).toBeInTheDocument()
  })

  it('renders N/A badge when value is null', () => {
    render(<KPICard kpi={makeKPI({ value: null, delta: null, trend: 'neutral' })} />)
    expect(screen.getByText('N/A')).toBeInTheDocument()
    // Value + unit string should not be rendered when null
    expect(screen.queryByText(/\d+ visits/)).not.toBeInTheDocument()
  })

  it('shows positive delta formatted correctly', () => {
    render(<KPICard kpi={makeKPI({ delta: 5.2, trend: 'good' })} />)
    expect(screen.getByText('+5.2%')).toBeInTheDocument()
  })

  it('shows negative delta formatted correctly', () => {
    render(<KPICard kpi={makeKPI({ delta: -3.1, trend: 'bad' })} />)
    expect(screen.getByText('-3.1%')).toBeInTheDocument()
  })

  it('shows — when delta is null', () => {
    render(<KPICard kpi={makeKPI({ delta: null, trend: 'neutral' })} />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('applies good trend color for positive higher_is_better', () => {
    render(<KPICard kpi={makeKPI({ trend: 'good' })} />)
    const trendEl = screen.getByText('+5.2%').closest('[data-trend]')
    expect(trendEl).toHaveAttribute('data-trend', 'good')
  })

  it('applies bad trend color for negative higher_is_better', () => {
    render(<KPICard kpi={makeKPI({ delta: -3.1, trend: 'bad' })} />)
    const trendEl = screen.getByText('-3.1%').closest('[data-trend]')
    expect(trendEl).toHaveAttribute('data-trend', 'bad')
  })
})
