// src/pages/DashboardPage.jsx
// Thin page — composes features, handles loading/error states. No business logic.

import { useHiveStore, useHiveData, HIVES, MetricCard, VarroaCard, TemperatureCard, WeightCard, NotificationsCard, HiveSelector } from '@/features/hive'
import { ExportButton } from '@/features/export'
import { LogoBee } from '@/components/ui'

function AlertBanner({ notifications }) {
  const critical = notifications.filter((n) => n.type === 'warn')
  if (!critical.length) return null

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 mb-4 rounded-xl animate-fade-down"
      style={{
        background: 'rgba(217,78,34,0.08)',
        border: '1px solid rgba(217,78,34,0.28)',
        animationDelay: '0.08s',
      }}
    >
      <span className="text-fluid-md flex-shrink-0 mt-0.5">⚠</span>
      <div className="flex flex-col gap-1">
        {critical.map((n) => (
          <p key={n.id} className="text-fluid-sm text-status-warn-pale leading-snug">
            <strong className="font-medium">{n.title}</strong>
            <span className="text-hive-muted ml-2 text-fluid-xs">{n.time}</span>
          </p>
        ))}
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-center">
        <div className="text-4xl mb-3 opacity-50">🐝</div>
        <p className="text-fluid-sm text-hive-muted tracking-widest uppercase">Fetching hive data…</p>
      </div>
    </div>
  )
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-center">
        <p className="text-status-warn-pale text-fluid-md mb-2">Failed to load hive data</p>
        <p className="text-hive-muted text-fluid-xs mb-4">{message}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg border border-medium text-gold-pale text-fluid-xs hover:bg-gold/10 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  )
}

function SyncStatus({ online, lastSync }) {
  return (
    <div className="text-right">
      <div className="flex items-center justify-end gap-1.5 mb-0.5">
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse-scale flex-shrink-0"
          style={{ background: online ? '#5d9e4e' : '#d94e22' }}
        />
        <span
          className="text-fluid-xs uppercase tracking-wider font-normal"
          style={{ color: online ? '#80c46e' : '#f07040' }}
        >
          {online ? 'Live' : 'Offline'}
        </span>
      </div>
      <p className="text-fluid-xs text-hive-muted">Sync: {lastSync}</p>
    </div>
  )
}

export function DashboardPage() {
  const selectedHiveId = useHiveStore((s) => s.selectedHiveId)
  const setSelectedHiveId = useHiveStore((s) => s.setSelectedHiveId)
  const { data, isLoading, isError, error, refetch } = useHiveData(selectedHiveId)

  const hiveInfo = HIVES.find((h) => h.id === selectedHiveId)
  const allHiveData = data ? { [selectedHiveId]: data } : {}

  return (
    // NOTE: no z-index class here — setting z-index creates a stacking context
    // which would trap portal dropdowns inside it. Keep this as position:relative only.
    <div className="relative min-h-screen bg-bg">
      <div className="max-w-dashboard mx-auto px-4 sm:px-6 lg:px-10 pb-16">

        {/* ── Header ──────────────────────────────────────── */}
        {/* Also no z-index on header — portals handle their own stacking */}
        <header className="flex items-center justify-between py-6 mb-7 animate-fade-down" style={{ borderBottom: '1px solid rgba(200,146,42,0.12)' }}>
          {/* Logo */}
          <div className="flex items-center gap-4">
            <LogoBee className="w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0" />
            <div>
              <h1 className="font-display text-fluid-xl font-medium tracking-tight leading-tight">
                <span className="text-gold-bright">bee</span>
                <span className="text-gold">·</span>
                <span className="text-cream">haviour</span>
              </h1>
              <p className="text-fluid-xs tracking-[0.22em] uppercase text-hive-muted mt-1">
                Hive Intelligence System
              </p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            <ExportButton allHiveData={allHiveData} />
            <SyncStatus online={hiveInfo?.online} lastSync={data?.lastSync ?? '—'} />
            <HiveSelector selectedId={selectedHiveId} onSelect={setSelectedHiveId} />
          </div>
        </header>

        {/* ── Content ─────────────────────────────────────── */}
        {isLoading && <LoadingState />}
        {isError && <ErrorState message={error?.message} onRetry={refetch} />}

        {data && (
          <>
            <AlertBanner notifications={data.notifications} />

            {/* Top metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <MetricCard
                icon="🔬" label="Varroa Infestation"
                value={data.varroa.current} unit="%" status={data.varroa.status}
                sublabel={`${data.varroa.beesAnalysed} bees · ${data.varroa.mitesDetected} mites`}
                animDelay={0.1}
              />
              <MetricCard
                icon="🌡" label="Hive Temperature"
                value={data.temperature.current} unit="°C" status={data.temperature.status}
                sublabel={`Brood zone · target ${data.temperature.target.min}–${data.temperature.target.max}°C`}
                animDelay={0.18}
              />
              <MetricCard
                icon="⚖" label="Hive Weight"
                value={data.weight.current} unit="kg" status={data.weight.status}
                sublabel={`${data.weight.change7d >= 0 ? '+' : ''}${data.weight.change7d} kg vs last week`}
                animDelay={0.26}
              />
            </div>

            {/* Varroa detail */}
            <div className="mb-3">
              <VarroaCard data={data.varroa} animDelay={0.32} />
            </div>

            {/* Temp + Weight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <TemperatureCard data={data.temperature} animDelay={0.38} />
              <WeightCard data={data.weight} animDelay={0.44} />
            </div>

            {/* Notifications */}
            <NotificationsCard notifications={data.notifications} animDelay={0.5} />
          </>
        )}
      </div>
    </div>
  )
}
