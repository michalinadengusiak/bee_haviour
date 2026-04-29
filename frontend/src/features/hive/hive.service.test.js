// src/features/hive/hive.service.test.js
import { describe, it, expect } from 'vitest'
import { getHiveReadings, getHives } from './hive.service'

describe('hive.service', () => {
  it('getHiveReadings returns correct data for hive-1', async () => {
    const data = await getHiveReadings('hive-1')
    expect(data.varroa.current).toBe(3.2)
    expect(data.temperature.status).toBe('ok')
    expect(data.notifications).toBeInstanceOf(Array)
  })

  it('getHiveReadings throws for unknown hive', async () => {
    await expect(getHiveReadings('hive-999')).rejects.toThrow('not found')
  })

  it('getHives returns all registered hives', async () => {
    const hives = await getHives()
    expect(hives).toHaveLength(3)
    expect(hives[0]).toHaveProperty('id')
    expect(hives[0]).toHaveProperty('lastSync')
  })
})
