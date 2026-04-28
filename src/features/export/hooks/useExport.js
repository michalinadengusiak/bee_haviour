// src/features/export/hooks/useExport.js
import { useState } from 'react'
import { exportToExcel, exportToCSV } from '../export.service'

/**
 * Provides export handlers with loading/done feedback states.
 * Accepts allHiveData so it can export all hives in one file.
 */
export function useExport(allHiveData) {
  const [state, setState] = useState({ loading: null, done: null })

  async function handleExport(format) {
    setState({ loading: format, done: null })
    try {
      if (format === 'xlsx') await exportToExcel(allHiveData)
      else exportToCSV(allHiveData)
      setState({ loading: null, done: format })
      setTimeout(() => setState({ loading: null, done: null }), 2500)
    } catch (err) {
      console.error('Export failed:', err)
      setState({ loading: null, done: null })
    }
  }

  return {
    exportXlsx: () => handleExport('xlsx'),
    exportCsv: () => handleExport('csv'),
    isLoading: state.loading !== null,
    loadingFormat: state.loading,
    doneFormat: state.done,
    isDone: state.done !== null,
  }
}
