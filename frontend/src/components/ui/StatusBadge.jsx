// src/components/ui/StatusBadge.jsx
import { STATUS_CONFIG } from '@/features/hive'

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.ok
  const pulse = status !== 'ok'

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
        text-fluid-xs font-medium tracking-widest uppercase
        ${cfg.twBg}
      `}
      style={{ color: cfg.text }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${pulse ? 'animate-pulse-scale' : ''}`}
        style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.color}` }}
      />
      {cfg.label}
    </span>
  )
}
