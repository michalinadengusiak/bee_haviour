// src/pages/DashboardPage.test.jsx
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, beforeEach } from 'vitest'
import { DashboardPage } from './DashboardPage'

beforeEach(() => {
  const store = {}
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: (k) => store[k] ?? null,
      setItem: (k, v) => { store[k] = v },
      removeItem: (k) => { delete store[k] },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]) },
    },
    writable: true,
  })
})

function wrapper({ children }) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

describe('DashboardPage', () => {
  it('shows loading state initially', () => {
    render(<DashboardPage />, { wrapper })
    expect(screen.getByText(/fetching hive data/i)).toBeInTheDocument()
  })

  it('renders metric cards after data loads', async () => {
    render(<DashboardPage />, { wrapper })
    await waitFor(
      () => expect(screen.getAllByText('Varroa Infestation').length).toBeGreaterThan(0),
      { timeout: 3000 }
    )
    expect(screen.getAllByText('Hive Temperature').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Hive Weight').length).toBeGreaterThan(0)
  })

  it('renders the alert banner for hive-1 (warn status)', async () => {
    render(<DashboardPage />, { wrapper })
    await waitFor(
      () => expect(screen.getAllByText(/varroa above treatment threshold/i).length).toBeGreaterThan(0),
      { timeout: 3000 }
    )
  })

  it('renders the logo', async () => {
    render(<DashboardPage />, { wrapper })
    await waitFor(
      () => expect(screen.getByText('haviour')).toBeInTheDocument(),
      { timeout: 3000 }
    )
  })
})
