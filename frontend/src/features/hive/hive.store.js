// src/features/hive/hive.store.js
// Client-side UI state only (selected hive, filters, preferences).
// Server state (actual sensor data) lives in React Query — not here.

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useHiveStore = create(
  persist(
    (set) => ({
      // Which hive is currently selected in the UI
      selectedHiveId: 'hive-1',
      setSelectedHiveId: (id) => set({ selectedHiveId: id }),

      // Weight chart time range preference — persisted across sessions
      weightTimeRange: 'week',
      setWeightTimeRange: (range) => set({ weightTimeRange: range }),
    }),
    {
      name: 'beehaviour-ui', // localStorage key
      partialize: (state) => ({
        // Only persist preferences, not transient UI state
        selectedHiveId: state.selectedHiveId,
        weightTimeRange: state.weightTimeRange,
      }),
    }
  )
)
