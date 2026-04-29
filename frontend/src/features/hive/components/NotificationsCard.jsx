// src/features/hive/components/NotificationsCard.jsx
import { Card, CardTitle, CardSubtitle } from '@/components/ui'

const TYPE = {
  ok:      { icon: '✓', color: '#5d9e4e', border: '#5d9e4e', bg: 'bg-notif-ok' },
  caution: { icon: '!', color: '#c89820', border: '#c89820', bg: 'bg-notif-caution' },
  warn:    { icon: '⚠', color: '#d94e22', border: '#d94e22', bg: 'bg-notif-warn' },
}

export function NotificationsCard({ notifications, animDelay = 0 }) {
  return (
    <Card animDelay={animDelay}>
      <CardTitle>Alerts</CardTitle>
      <div className="mb-3"><CardSubtitle>Recent notifications</CardSubtitle></div>

      <div className="flex flex-col gap-2">
        {notifications.map((n) => {
          const cfg = TYPE[n.type] ?? TYPE.ok
          return (
            <div
              key={n.id}
              className={`flex items-start gap-3 px-3 py-2.5 rounded-r-lg animate-slide-in ${cfg.bg}`}
              style={{ borderLeft: `2px solid ${cfg.border}` }}
            >
              <span className="text-fluid-sm font-semibold flex-shrink-0 mt-px w-4 text-center" style={{ color: cfg.color }}>
                {cfg.icon}
              </span>
              <div>
                <p className="text-fluid-sm text-cream leading-snug">{n.title}</p>
                <p className="text-fluid-xs text-hive-muted mt-0.5">{n.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
