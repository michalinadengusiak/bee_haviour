// src/components/ui/StatusBadge.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it('renders Optimal for ok status', () => {
    render(<StatusBadge status="ok" />)
    expect(screen.getByText('Optimal')).toBeInTheDocument()
  })

  it('renders Action Required for warn status', () => {
    render(<StatusBadge status="warn" />)
    expect(screen.getByText('Action Required')).toBeInTheDocument()
  })

  it('falls back to ok for unknown status', () => {
    render(<StatusBadge status="unknown" />)
    expect(screen.getByText('Optimal')).toBeInTheDocument()
  })
})
