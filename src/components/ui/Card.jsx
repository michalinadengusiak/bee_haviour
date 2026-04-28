// src/components/ui/Card.jsx
// Base card shell — note: NO overflow:hidden so nothing clips portal dropdowns.
// The top accent bar uses border-top instead of an absolutely positioned child.

export function Card({ children, className = '', accentStatus, animDelay = 0 }) {
  const accentColors = {
    ok:      '#5d9e4e',
    caution: '#c89820',
    warn:    '#d94e22',
  }
  const accentColor = accentColors[accentStatus]

  return (
    <div
      className={`rounded-xl bg-bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover animate-fade-up ${className}`}
      style={{
        border: '1px solid rgba(200,146,42,0.12)',
        // Top accent via border-top — avoids needing overflow:hidden
        borderTop: accentColor ? `2px solid ${accentColor}` : '1px solid rgba(200,146,42,0.12)',
        animationDelay: `${animDelay}s`,
        // Intentionally NO overflow:hidden — dropdowns inside must not be clipped
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(200,146,42,0.38)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = accentColor ? accentColor : 'rgba(200,146,42,0.12)' }}
    >
      <div className="p-fluid-card">{children}</div>
    </div>
  )
}

export function CardTitle({ children }) {
  return (
    <p className="font-display text-fluid-xl font-normal text-cream mb-1">{children}</p>
  )
}

export function CardSubtitle({ children }) {
  return (
    <p className="text-fluid-xs tracking-[0.18em] uppercase text-hive-muted">{children}</p>
  )
}
