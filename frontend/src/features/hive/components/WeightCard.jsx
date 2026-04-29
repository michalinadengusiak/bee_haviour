// src/features/hive/components/WeightCard.jsx
import { Card, CardTitle, CardSubtitle, StatusBadge } from '@/components/ui'
import { ScatterChart } from '@/components/charts'

function weightColor(val, baseline) {
  const diff = val - baseline
  if (diff < -2) return '#d94e22'
  if (diff < -0.5) return '#c89820'
  return '#5d9e4e'
}

export function WeightCard({ data, animDelay = 0 }) {
  const { current, trend, change7d, status } = data
  const baseline = trend[0]
  const sign = change7d >= 0 ? '+' : ''
  const changeColor = change7d >= 0 ? '#80c46e' : change7d < -1 ? '#f07040' : '#e4b83a'

  return (
    <Card animDelay={animDelay}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <CardTitle>Hive Weight</CardTitle>
          <CardSubtitle>Load cell · history</CardSubtitle>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-display text-fluid-xl font-normal text-gold-pale leading-none">
            {current}
            <span className="font-body text-fluid-sm font-light text-hive-muted ml-1">kg</span>
          </div>
          <div className="text-fluid-sm mt-1" style={{ color: changeColor }}>
            {sign}{change7d} kg this week
          </div>
          <div className="mt-1.5">
            <StatusBadge status={status} />
          </div>
        </div>
      </div>
      <ScatterChart
        data={trend}
        type="weight"
        colorFn={(v) => weightColor(v, baseline)}
        unit=" kg"
        height={110}
        showRangePicker
      />
    </Card>
  )
}
