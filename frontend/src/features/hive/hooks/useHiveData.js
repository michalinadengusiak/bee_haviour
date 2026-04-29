// src/features/hive/hooks/useHiveData.js
// Encapsulates all server-state fetching for a hive.
// Components just call this — they never know about fetch or React Query.

import { useQuery } from '@tanstack/react-query'
import { getHiveReadings } from '../hive.service'

export const hiveKeys = {
  all: ['hives'],
  readings: (id) => ['hives', id, 'readings'],
}

/**
 * Fetches and caches readings for the given hive.
 * Automatically refetches every 60 seconds (matches Pi polling interval).
 */
export function useHiveData(hiveId) {
  return useQuery({
    queryKey: hiveKeys.readings(hiveId),
    queryFn: () => getHiveReadings(hiveId),
    refetchInterval: 60 * 1000,
    enabled: Boolean(hiveId),
  })
}
