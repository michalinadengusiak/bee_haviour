// src/components/charts/MiniBarChart.jsx
import { DAYS } from '@/features/hive'

export function MiniBarChart({ data, unit = '', colorFn, height = 80 }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  return (
    <div>
      <div className="flex items-end gap-1 px-0.5" style={{ height }}>
        {data.map((val, i) => {
          const pct = ((val - min) / range) * 0.65 + 0.15
          const color = colorFn ? colorFn(val) : '#c8922a'
          const isToday = i === data.length - 1
          return (
            <div
              key={i}
              title={`${val}${unit}`}
              className="flex-1 rounded-t-sm cursor-default transition-opacity duration-200"
              style={{
                height: `${pct * 100}%`,
                background: color,
                opacity: isToday ? 1 : 0.5,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = isToday ? '1' : '0.5')}
            />
          )
        })}
      </div>
      <div className="flex gap-1 px-0.5 mt-1.5">
        {DAYS.map((d, i) => (
          <div
            key={d}
            className={`flex-1 text-center tracking-wide ${
              i === DAYS.length - 1
                ? 'text-gold-pale font-medium'
                : 'text-hive-dim'
            }`}
            style={{ fontSize: '0.5625rem' }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  )
}
