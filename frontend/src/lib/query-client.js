// src/lib/query-client.js
// Central React Query client configuration.
// Tune staleTime/gcTime here to control how aggressively data is re-fetched.

import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 60 seconds — matches Pi polling interval
      staleTime: 60 * 1000,
      // Keep unused data in cache for 5 minutes
      gcTime: 5 * 60 * 1000,
      // Retry failed requests once before showing an error
      retry: 1,
      // Refetch when the browser tab regains focus
      refetchOnWindowFocus: true,
    },
  },
})
