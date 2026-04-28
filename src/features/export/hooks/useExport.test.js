// src/features/export/hooks/useExport.test.js
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useExport } from './useExport'
import * as service from '../export.service'

describe('useExport', () => {
  it('starts in idle state', () => {
    const { result } = renderHook(() => useExport({}))
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isDone).toBe(false)
  })

  it('sets loading then done for xlsx export', async () => {
    vi.spyOn(service, 'exportToExcel').mockResolvedValue(undefined)
    const { result } = renderHook(() => useExport({}))

    await act(async () => {
      await result.current.exportXlsx()
    })

    expect(result.current.isDone).toBe(true)
    expect(result.current.doneFormat).toBe('xlsx')
  })

  it('sets loading then done for csv export', async () => {
    vi.spyOn(service, 'exportToCSV').mockImplementation(() => {})
    const { result } = renderHook(() => useExport({}))

    await act(async () => {
      await result.current.exportCsv()
    })

    expect(result.current.isDone).toBe(true)
    expect(result.current.doneFormat).toBe('csv')
  })
})
