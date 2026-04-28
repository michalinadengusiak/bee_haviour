// src/features/hive/components/MetricCard.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MetricCard } from './MetricCard'

describe('MetricCard', () => {
  const baseProps = {
    icon: '🔬',
    label: 'Varroa Infestation',
    value: 3.2,
    unit: '%',
    status: 'warn',
    sublabel: '847 bees · 27 mites',
  }

  it('renders the value and unit', () => {
    render(<MetricCard {...baseProps} />)
    expect(screen.getByText('3.2')).toBeInTheDocument()
    expect(screen.getByText('%')).toBeInTheDocument()
  })

  it('renders the label', () => {
    render(<MetricCard {...baseProps} />)
    expect(screen.getByText('Varroa Infestation')).toBeInTheDocument()
  })

  it('renders the sublabel', () => {
    render(<MetricCard {...baseProps} />)
    expect(screen.getByText('847 bees · 27 mites')).toBeInTheDocument()
  })

  it('renders status badge', () => {
    render(<MetricCard {...baseProps} />)
    expect(screen.getByText('Action Required')).toBeInTheDocument()
  })

  it('renders ok badge for ok status', () => {
    render(<MetricCard {...baseProps} status="ok" />)
    expect(screen.getByText('Optimal')).toBeInTheDocument()
  })
})
