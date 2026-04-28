// src/features/hive/components/TemperatureCard.jsx
import { Card, CardTitle, CardSubtitle, StatusBadge } from '@/components/ui'
import { ScatterChart } from '@/components/charts'

function tempColor(val) {
  if (val < 33 || val > 37) return '#d94e22'
  if (val < 34 || val > 36) return '#c89820'
  return '#5d9e4e'
}

export function TemperatureCard({ data, animDelay = 0 }) {
  const { current, trend, target, status } = data

  return (
    <Card animDelay={animDelay}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <CardTitle>Temperature</CardTitle>
          <CardSubtitle>Brood zone · target {target.min}–{target.max}°C</CardSubtitle>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="font-display text-fluid-xl font-normal" style={{ color: tempColor(current) }}>
            {current}°C
          </span>
          <StatusBadge status={status} />
        </div>
      </div>
      <ScatterChart data={trend} type="temp" colorFn={tempColor} unit="°C" height={110} />
    </Card>
  )
}
