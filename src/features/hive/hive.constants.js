// src/features/hive/hive.constants.js
// Pure data constants — no side effects, easily replaceable.

export const HIVES = [
  {
    id: 'hive-1',
    name: 'Garden Apiary',
    location: 'Back garden – south-facing',
    queen: 'Italian, marked 2023',
    online: true,
  },
  {
    id: 'hive-2',
    name: 'Orchard Hive',
    location: 'East orchard – apple trees',
    queen: 'Carniolan, marked 2024',
    online: true,
  },
  {
    id: 'hive-3',
    name: 'Meadow Station',
    location: 'North meadow – wildflowers',
    queen: 'Buckfast, marked 2022',
    online: false,
  },
]

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const VARROA_THRESHOLD = 2.0 // % — treatment recommended above this

export const TEMP_TARGET = { min: 34, max: 36 } // °C brood zone

/** Maps status key → display config used by StatusBadge and MetricCard */
export const STATUS_CONFIG = {
  ok: {
    label: 'Optimal',
    color: '#5d9e4e',
    bg: 'rgba(93,158,78,0.10)',
    text: '#80c46e',
    twBg: 'bg-status-ok',
    twText: 'text-status-ok-pale',
    twAccent: 'accent-ok',
  },
  caution: {
    label: 'Monitor Closely',
    color: '#c89820',
    bg: 'rgba(200,152,32,0.10)',
    text: '#e4b83a',
    twBg: 'bg-status-caution',
    twText: 'text-status-caution-pale',
    twAccent: 'accent-caution',
  },
  warn: {
    label: 'Action Required',
    color: '#d94e22',
    bg: 'rgba(217,78,34,0.10)',
    text: '#f07040',
    twBg: 'bg-status-warn',
    twText: 'text-status-warn-pale',
    twAccent: 'accent-warn',
  },
}
