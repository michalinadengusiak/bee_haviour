// src/features/hive/components/VarroaCard.jsx
import { Card, CardTitle, CardSubtitle, StatusBadge } from '@/components/ui'
import { MiniBarChart } from '@/components/charts'
import { VARROA_THRESHOLD } from '@/features/hive'

function varroaColor(val) {
  if (val <= 1.5) return '#5d9e4e'
  if (val <= VARROA_THRESHOLD) return '#c89820'
  return '#d94e22'
}

function StatPill({ value, label, color }) {
  return (
    <div className="flex-1 bg-bg-2 border border-subtle rounded-lg py-2 text-center">
      <div className="font-display text-fluid-lg font-normal leading-none" style={{ color }}>
        {value}
      </div>
      <div className="text-hive-muted uppercase tracking-wider mt-1" style={{ fontSize: '0.5625rem' }}>
        {label}
      </div>
    </div>
  )
}

export function VarroaCard({ data, animDelay = 0 }) {
  const { current, trend, beesAnalysed, mitesDetected, confidence, status } = data
  const pct = Math.min((current / 5) * 100, 100)
  const aboveThreshold = current > VARROA_THRESHOLD
  const change7d = (trend[trend.length - 1] - trend[0]).toFixed(1)

  return (
    <Card animDelay={animDelay}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <CardTitle>Varroa Analysis</CardTitle>
          <CardSubtitle>Deep learning · RPi Camera v3</CardSubtitle>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Gauge */}
      <div className="mb-4">
        <div className="flex justify-between text-fluid-sm text-hive-muted mb-2">
          <span>Mite load</span>
          <span style={{ color: varroaColor(current) }}>
            {current}% — {aboveThreshold ? 'above threshold' : 'below threshold'}
          </span>
        </div>
        <div className="relative h-2 bg-bg-3 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg,#5d9e4e,${varroaColor(current)})` }}
          />
          <div className="absolute top-0 bottom-0 w-0.5 bg-gold/50" style={{ left: `${(VARROA_THRESHOLD / 5) * 100}%` }} />
        </div>
        <div className="flex justify-between mt-1.5 text-hive-dim" style={{ fontSize: '0.5625rem' }}>
          <span>0%</span>
          <span className="text-gold/70">↑ 2% treatment threshold</span>
          <span>5%+</span>
        </div>
      </div>

      {/* Two-column detail */}
      <div className="grid grid-cols-2 gap-3">
        {/* Latest scan */}
        <div className="bg-bg-3 border border-subtle rounded-xl p-3">
          <p className="text-hive-muted uppercase tracking-wider mb-3" style={{ fontSize: '0.5625rem' }}>Latest Scan</p>

          {/* Mock camera frame */}
          <div className="relative bg-bg-2 border border-medium border-dashed rounded-lg mb-3 overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 55%,rgba(200,146,42,0.1) 0%,transparent 70%)' }} />
            {[
              { top: '35%', left: '28%', w: 22, h: 14, conf: 94 },
              { top: '55%', left: '58%', w: 18, h: 12, conf: 88 },
              { top: '25%', left: '52%', w: 20, h: 13, conf: 91 },
            ].map((box, i) => (
              <div key={i} className="absolute border border-status-warn rounded-sm" style={{ top: box.top, left: box.left, width: box.w, height: box.h }}>
                <span className="absolute -top-4 left-0 text-white px-1 py-px rounded-sm whitespace-nowrap" style={{ fontSize: 7, background: 'rgba(217,78,34,0.85)' }}>
                  {box.conf}%
                </span>
              </div>
            ))}
            <span className="relative z-10 text-hive-muted" style={{ fontSize: '0.625rem' }}>Frame #3</span>
          </div>

          <div className="flex gap-2">
            <StatPill value={mitesDetected} label="Mites" color="#f07040" />
            <StatPill value={beesAnalysed} label="Bees" color="#edc96a" />
            <StatPill value={`${confidence}%`} label="Conf." color="#80c46e" />
          </div>
        </div>

        {/* 7-day trend */}
        <div className="bg-bg-3 border border-subtle rounded-xl p-3 flex flex-col">
          <p className="text-hive-muted uppercase tracking-wider mb-3" style={{ fontSize: '0.5625rem' }}>7-Day Trend</p>
          <div className="flex-1">
            <MiniBarChart data={trend} unit="%" colorFn={varroaColor} height={90} />
          </div>
          <div className="flex gap-2 mt-3">
            <StatPill value={`+${change7d}%`} label="7d change" color="#f07040" />
            <StatPill value={aboveThreshold ? '↑ Rising' : '→ Stable'} label="Trend" color={aboveThreshold ? '#f07040' : '#80c46e'} />
          </div>
        </div>
      </div>
    </Card>
  )
}
