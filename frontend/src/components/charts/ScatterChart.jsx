// src/components/charts/ScatterChart.jsx
import { useMemo } from 'react'
import { useHiveStore } from '@/features/hive'

const TIME_RANGES = [
  { key: 'week', label: 'Week', points: 7 },
  { key: 'month', label: 'Month', points: 30 },
  { key: 'year', label: 'Year', points: 52 },
]

function generateHistory(seed, points, type) {
  if (points <= seed.length) return seed.slice(-points)
  const result = [...seed]
  let last = seed[seed.length - 1]
  const variance = type === 'temp' ? 0.6 : 0.3
  while (result.length < points) {
    last = parseFloat((last + (Math.random() - 0.52) * variance).toFixed(2))
    result.unshift(last)
  }
  return result.slice(-points)
}

function generateLabels(points) {
  const now = new Date()
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  if (points === 7) {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now)
      d.setDate(now.getDate() - (6 - i))
      return DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1]
    })
  }
  if (points === 30) {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(now)
      d.setDate(now.getDate() - (29 - i))
      return i % 5 === 0 ? `${d.getDate()}/${d.getMonth() + 1}` : ''
    })
  }
  return Array.from({ length: points }, (_, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() - (points - 1 - i) * 7)
    return i % 8 === 0
      ? `W${Math.ceil(d.getDate() / 7)} ${d.toLocaleString('default', { month: 'short' })}`
      : ''
  })
}

export function ScatterChart({ data, type, colorFn, unit = '', showRangePicker = false, height = 110 }) {
  // Weight range stored in Zustand (persisted) — temp uses local logic
  const storeRange = useHiveStore((s) => s.weightTimeRange)
  const setStoreRange = useHiveStore((s) => s.setWeightTimeRange)
  const activeRange = showRangePicker ? storeRange : 'week'
  const rangeConfig = TIME_RANGES.find((r) => r.key === activeRange)

  const history = useMemo(
    () => generateHistory(data, rangeConfig.points, type),
    [data, activeRange, type]
  )
  const labels = useMemo(() => generateLabels(rangeConfig.points), [activeRange])

  const W = 480
  const PAD = { top: 12, right: 12, bottom: 26, left: 34 }
  const innerW = W - PAD.left - PAD.right
  const innerH = height - PAD.top - PAD.bottom
  const min = Math.min(...history)
  const max = Math.max(...history)
  const vRange = max - min || 1

  const toX = (i) => PAD.left + (i / (history.length - 1)) * innerW
  const toY = (v) => PAD.top + innerH - ((v - min) / vRange) * innerH

  const linePath = history.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(v)}`).join(' ')
  const areaPath = [`M ${toX(0)} ${PAD.top + innerH}`, ...history.map((v, i) => `L ${toX(i)} ${toY(v)}`), `L ${toX(history.length - 1)} ${PAD.top + innerH}`, 'Z'].join(' ')
  const yTicks = [min, (min + max) / 2, max].map((v) => ({ v: parseFloat(v.toFixed(1)), y: toY(v) }))
  const latestColor = colorFn ? colorFn(history[history.length - 1]) : '#c8922a'

  return (
    <div>
      {showRangePicker && (
        <div className="flex gap-1.5 mb-3">
          {TIME_RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setStoreRange(r.key)}
              className={`px-3 py-1 rounded-full text-fluid-xs transition-all duration-200 border ${
                activeRange === r.key
                  ? 'border-strong text-gold-pale font-medium'
                  : 'border-subtle text-hive-muted hover:border-medium'
              }`}
              style={activeRange === r.key ? { background: 'rgba(200,146,42,0.12)' } : {}}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${height + PAD.bottom}`} className="w-full overflow-visible" style={{ height: height + PAD.bottom }}>
        <defs>
          <linearGradient id={`areaGrad-${type}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={latestColor} stopOpacity="0.18" />
            <stop offset="100%" stopColor={latestColor} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {yTicks.map((t) => (
          <g key={t.v}>
            <line x1={PAD.left} y1={t.y} x2={W - PAD.right} y2={t.y} stroke="rgba(200,146,42,0.08)" strokeWidth="1" strokeDasharray="4 4" />
            <text x={PAD.left - 5} y={t.y + 4} textAnchor="end" fontSize="9" fill="rgba(120,90,50,0.8)" fontFamily="Jost,sans-serif">{t.v}{unit}</text>
          </g>
        ))}
        <path d={areaPath} fill={`url(#areaGrad-${type})`} />
        <path d={linePath} fill="none" stroke={latestColor} strokeWidth="1.5" strokeOpacity="0.5" strokeLinejoin="round" />
        {history.map((v, i) => {
          const isToday = i === history.length - 1
          const color = colorFn ? colorFn(v) : '#c8922a'
          const x = toX(i), y = toY(v)
          return (
            <g key={i}>
              {isToday && <circle cx={x} cy={y} r={8} fill={color} fillOpacity="0.15" />}
              <circle cx={x} cy={y} r={isToday ? 4 : rangeConfig.points > 20 ? 2 : 3} fill={color} fillOpacity={isToday ? 1 : 0.65} stroke={isToday ? 'rgba(255,255,255,0.3)' : 'none'} strokeWidth="1.5">
                <title>{v}{unit}</title>
              </circle>
            </g>
          )
        })}
        {labels.map((lbl, i) =>
          lbl ? (
            <text key={i} x={toX(i)} y={height + PAD.bottom - 4} textAnchor="middle" fontSize="9" fill={i === history.length - 1 ? 'rgba(237,201,106,0.9)' : 'rgba(90,60,30,0.7)'} fontFamily="Jost,sans-serif">{lbl}</text>
          ) : null
        )}
      </svg>
    </div>
  )
}
