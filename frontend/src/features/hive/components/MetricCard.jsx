// src/features/hive/components/MetricCard.jsx
import { Card, StatusBadge } from '@/components/ui'
import { STATUS_CONFIG } from '@/features/hive'

export function MetricCard({ icon, label, value, unit, sublabel, status, animDelay = 0 }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.ok

  return (
    <Card accentStatus={status} animDelay={animDelay}>
      <div className="flex items-center gap-2 text-fluid-xs tracking-[0.18em] uppercase text-hive-muted mb-3">
        <span className="text-fluid-md">{icon}</span>
        {label}
      </div>

      <div className="font-display text-fluid-hero font-normal leading-none tracking-tight mb-2.5" style={{ color: cfg.text }}>
        {value}
        <span className="font-body text-fluid-md font-light text-hive-muted ml-1">{unit}</span>
      </div>

      <StatusBadge status={status} />

      {sublabel && (
        <p className="mt-2.5 text-fluid-xs text-hive-muted leading-relaxed">{sublabel}</p>
      )}
    </Card>
  )
}
