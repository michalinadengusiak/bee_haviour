/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Base backgrounds
        bg: {
          DEFAULT: '#190e02',
          2: '#201305',
          3: '#2a1a08',
          card: '#1e1105',
        },
        // Gold palette
        gold: {
          DEFAULT: '#c8922a',
          bright: '#e0a83a',
          pale: '#edc96a',
        },
        cream: {
          DEFAULT: '#f0ddb8',
          dim: '#b09868',
        },
        // Status colours
        status: {
          ok: '#5d9e4e',
          'ok-pale': '#80c46e',
          caution: '#c89820',
          'caution-pale': '#e4b83a',
          warn: '#d94e22',
          'warn-pale': '#f07040',
        },
        // Text
        hive: {
          text: '#dcc89a',
          muted: '#7a6040',
          dim: '#4a3820',
        },
      },
      fontFamily: {
        display: ['Lora', 'Georgia', 'serif'],
        body: ['Jost', 'sans-serif'],
      },
      fontSize: {
        // Fluid type scale using clamp
        'fluid-xs':   ['clamp(0.625rem, 0.85vw, 0.75rem)',   { lineHeight: '1.5' }],
        'fluid-sm':   ['clamp(0.75rem,  1vw,    0.875rem)',   { lineHeight: '1.5' }],
        'fluid-base': ['clamp(0.8rem,   1.1vw,  0.9375rem)', { lineHeight: '1.6' }],
        'fluid-md':   ['clamp(0.9rem,   1.3vw,  1.125rem)',  { lineHeight: '1.4' }],
        'fluid-lg':   ['clamp(1.1rem,   1.6vw,  1.375rem)',  { lineHeight: '1.3' }],
        'fluid-xl':   ['clamp(1.375rem, 2vw,    1.75rem)',   { lineHeight: '1.2' }],
        'fluid-hero': ['clamp(2.375rem, 3.5vw,  3.5rem)',    { lineHeight: '1' }],
      },
      spacing: {
        'fluid-sm': 'clamp(0.625rem, 1vw, 0.875rem)',
        'fluid-md': 'clamp(0.875rem, 1.4vw, 1.25rem)',
        'fluid-lg': 'clamp(1.125rem, 1.8vw, 1.625rem)',
        'fluid-card': 'clamp(1.125rem, 1.8vw, 1.75rem)',
      },
      borderColor: {
        subtle: 'rgba(200, 146, 42, 0.12)',
        medium: 'rgba(200, 146, 42, 0.22)',
        strong: 'rgba(200, 146, 42, 0.38)',
      },
      borderRadius: {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.25rem',
      },
      boxShadow: {
        'glow-ok':      '0 0 8px rgba(93, 158, 78, 0.6)',
        'glow-warn':    '0 0 8px rgba(217, 78, 34, 0.6)',
        'glow-caution': '0 0 8px rgba(200, 152, 32, 0.6)',
        'glow-gold':    '0 0 8px rgba(200, 146, 42, 0.4)',
        'card-hover':   '0 4px 24px rgba(0,0,0,0.4)',
        dropdown:       '0 8px 32px rgba(0,0,0,0.55)',
      },
      animation: {
        'fade-down':    'fadeDown 0.6s ease both',
        'fade-up':      'fadeUp 0.55s ease both',
        'slide-in':     'slideIn 0.4s ease both',
        'pulse-scale':  'scalePulse 2s ease infinite',
        'spin-slow':    'spin 1s linear infinite',
      },
      keyframes: {
        fadeDown: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-8px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        scalePulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%':      { transform: 'scale(1.15)', opacity: '0.55' },
        },
      },
      maxWidth: {
        dashboard: '90rem', // 1440px — content cap
      },
      backgroundImage: {
        honeycomb: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='64'%3E%3Cpolygon points='28,2 54,16 54,48 28,62 2,48 2,16' fill='none' stroke='rgba(200,146,42,0.045)' stroke-width='1'/%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        honeycomb: '56px 64px',
      },
    },
  },
  plugins: [],
}
