// src/app/Providers.jsx
// Wraps the whole app with all required React context providers.
// Add new providers here — keeps main.jsx clean.

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/query-client'

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools only included in dev builds */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
