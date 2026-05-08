import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DatasetTabs } from '@/components/DatasetTabs'

describe('DatasetTabs', () => {
  it('renders all four dataset tabs', () => {
    render(<DatasetTabs active="A" onSelect={vi.fn()} />)
    expect(screen.getByRole('tab', { name: 'Dataset A' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Dataset B' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Dataset C' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Dataset D' })).toBeInTheDocument()
  })

  it('marks the active dataset as selected', () => {
    render(<DatasetTabs active="B" onSelect={vi.fn()} />)
    expect(screen.getByRole('tab', { name: 'Dataset B' })).toHaveAttribute(
      'data-state',
      'active',
    )
    expect(screen.getByRole('tab', { name: 'Dataset A' })).toHaveAttribute(
      'data-state',
      'inactive',
    )
  })

  it('calls onSelect with the clicked dataset key', async () => {
    const onSelect = vi.fn()
    render(<DatasetTabs active="A" onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('tab', { name: 'Dataset C' }))
    expect(onSelect).toHaveBeenCalledWith('C')
  })
})
