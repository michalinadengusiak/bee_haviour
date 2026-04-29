// src/components/ui/LogoBee.jsx
export function LogoBee({ className = 'w-12 h-12' }) {
  return (
    <svg viewBox="0 0 100 115" className={className} xmlns="http://www.w3.org/2000/svg" aria-label="bee·haviour logo">
      <defs>
        <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8b84b" />
          <stop offset="100%" stopColor="#c8922a" />
        </linearGradient>
        <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8b84b" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#c8922a" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <polygon points="50,4 96,27 96,73 50,96 4,73 4,27" fill="none" stroke="url(#hexGrad)" strokeWidth="2.5" />
      <ellipse cx="31" cy="44" rx="14" ry="7" fill="url(#wingGrad)" transform="rotate(-22 31 44)" />
      <ellipse cx="69" cy="44" rx="14" ry="7" fill="url(#wingGrad)" transform="rotate(22 69 44)" />
      <ellipse cx="34" cy="55" rx="10" ry="5.5" fill="url(#wingGrad)" transform="rotate(-14 34 55)" />
      <ellipse cx="66" cy="55" rx="10" ry="5.5" fill="url(#wingGrad)" transform="rotate(14 66 55)" />
      <ellipse cx="50" cy="53" rx="9.5" ry="14" fill="url(#hexGrad)" />
      <rect x="41" y="52" width="18" height="2.5" rx="1.2" fill="#190e02" opacity="0.5" />
      <rect x="41" y="57" width="18" height="2.5" rx="1.2" fill="#190e02" opacity="0.5" />
      <circle cx="50" cy="38" r="7" fill="url(#hexGrad)" />
      <line x1="47" y1="32" x2="41" y2="22" stroke="url(#hexGrad)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="53" y1="32" x2="59" y2="22" stroke="url(#hexGrad)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="40" cy="21" r="2.2" fill="url(#hexGrad)" />
      <circle cx="60" cy="21" r="2.2" fill="url(#hexGrad)" />
      <path d="M45,68 Q50,80 55,68" fill="url(#hexGrad)" opacity="0.75" />
      <ellipse cx="42" cy="74" rx="5.5" ry="3" fill="url(#hexGrad)" opacity="0.6" transform="rotate(-30 42 74)" />
      <ellipse cx="58" cy="74" rx="5.5" ry="3" fill="url(#hexGrad)" opacity="0.6" transform="rotate(30 58 74)" />
    </svg>
  )
}
