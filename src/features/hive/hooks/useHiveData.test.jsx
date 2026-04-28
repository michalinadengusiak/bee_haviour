// src/features/hive/hooks/useHiveData.test.js
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi } from 'vitest'
import { useHiveData } from './useHiveData'
import * as service from '../hive.service'

function wrapper({ children }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

describe('useHiveData', () => {
  it('returns data for a valid hive', async () => {
    const { result } = renderHook(() => useHiveData('hive-1'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data.varroa.current).toBe(3.2)
    expect(result.current.data.temperature.current).toBe(34.8)
  })

  it('returns error state for an unknown hive', async () => {
    const { result } = renderHook(() => useHiveData('hive-999'), { wrapper })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error.message).toMatch(/not found/)
  })

  it('is disabled when hiveId is falsy', () => {
    const { result } = renderHook(() => useHiveData(null), { wrapper })
    expect(result.current.fetchStatus).toBe('idle')
  })
})
