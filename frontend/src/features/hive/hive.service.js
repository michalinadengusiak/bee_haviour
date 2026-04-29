// src/features/hive/hive.service.js
// All API calls live here. Components never call fetch() directly.
// To connect to a real Pi: replace MOCK_DATA with actual fetch() calls.
// The shape of the returned objects must stay the same — components won't need changes.

const MOCK_DATA = {
  'hive-1': {
    lastSync: '2 min ago',
    varroa: {
      current: 3.2,
      trend: [0.8, 1.2, 1.6, 1.9, 2.3, 2.8, 3.2],
      beesAnalysed: 847,
      mitesDetected: 27,
      confidence: 91,
      status: 'warn',
    },
    temperature: {
      current: 34.8,
      trend: [34.2, 34.5, 34.9, 35.2, 34.7, 34.4, 34.8],
      target: { min: 34, max: 36 },
      status: 'ok',
    },
    weight: {
      current: 28.4,
      trend: [29.8, 29.6, 29.4, 29.1, 28.9, 28.6, 28.4],
      change7d: -1.4,
      status: 'caution',
    },
    notifications: [
      { id: 1, type: 'warn', title: 'Varroa above treatment threshold', time: 'Today, 08:14' },
      { id: 2, type: 'caution', title: 'Hive weight declining — check stores', time: 'Yesterday, 14:02' },
      { id: 3, type: 'ok', title: 'Temperature stable — brood healthy', time: '3 days ago' },
    ],
  },
  'hive-2': {
    lastSync: '5 min ago',
    varroa: {
      current: 1.1,
      trend: [0.6, 0.7, 0.9, 1.0, 1.0, 1.1, 1.1],
      beesAnalysed: 1024,
      mitesDetected: 11,
      confidence: 94,
      status: 'ok',
    },
    temperature: {
      current: 35.3,
      trend: [35.0, 35.1, 35.3, 35.4, 35.2, 35.3, 35.3],
      target: { min: 34, max: 36 },
      status: 'ok',
    },
    weight: {
      current: 34.1,
      trend: [33.2, 33.5, 33.8, 34.0, 34.0, 34.1, 34.1],
      change7d: 0.9,
      status: 'ok',
    },
    notifications: [
      { id: 1, type: 'ok', title: 'All metrics within normal range', time: 'Today, 07:50' },
      { id: 2, type: 'ok', title: 'Weight gain detected — good nectar flow', time: '2 days ago' },
    ],
  },
  'hive-3': {
    lastSync: '18 min ago',
    varroa: {
      current: 2.0,
      trend: [1.4, 1.5, 1.7, 1.8, 1.9, 2.0, 2.0],
      beesAnalysed: 612,
      mitesDetected: 12,
      confidence: 87,
      status: 'caution',
    },
    temperature: {
      current: 33.1,
      trend: [35.0, 34.8, 34.2, 33.8, 33.5, 33.2, 33.1],
      target: { min: 34, max: 36 },
      status: 'warn',
    },
    weight: {
      current: 22.7,
      trend: [24.1, 23.8, 23.5, 23.3, 23.1, 22.9, 22.7],
      change7d: -1.4,
      status: 'warn',
    },
    notifications: [
      { id: 1, type: 'warn', title: 'Temperature below brood range — inspect immediately', time: 'Today, 06:30' },
      { id: 2, type: 'warn', title: 'Sensor offline for 18 minutes', time: 'Today, 06:12' },
      { id: 3, type: 'caution', title: 'Varroa approaching treatment threshold', time: 'Yesterday, 19:45' },
      { id: 4, type: 'caution', title: 'Sustained weight loss over 7 days', time: '2 days ago' },
    ],
  },
}

// Simulates network latency for realistic loading states during development
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Fetch readings for a single hive.
 * @param {string} hiveId
 * @returns {Promise<HiveData>}
 *
 * Real implementation:
 *   const res = await fetch(`${import.meta.env.VITE_PI_API_URL}/hives/${hiveId}/readings`)
 *   if (!res.ok) throw new Error(`Failed to fetch hive ${hiveId}`)
 *   return res.json()
 */
export async function getHiveReadings(hiveId) {
  await delay(300)
  const data = MOCK_DATA[hiveId]
  if (!data) throw new Error(`Hive ${hiveId} not found`)
  return data
}

/**
 * Fetch the list of registered hives (metadata only, no sensor data).
 * @returns {Promise<Hive[]>}
 */
export async function getHives() {
  await delay(150)
  return Object.entries(MOCK_DATA).map(([id, d]) => ({
    id,
    lastSync: d.lastSync,
  }))
}
