// src/features/export/export.service.js
// All export logic isolated here. UI components just call the functions.

import ExcelJS from 'exceljs'
import { HIVES, DAYS } from '@/features/hive'

// ── Helpers ──────────────────────────────────────────────────────────────────

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: filename })
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function buildRows(hiveData) {
  const today = new Date()
  return hiveData.varroa.trend.map((v, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    return {
      date: d.toISOString().split('T')[0],
      day: DAYS[i],
      varroa: v,
      temperature: hiveData.temperature.trend[i],
      weight: hiveData.weight.trend[i],
    }
  })
}

// ── Colour palette (ARGB) ─────────────────────────────────────────────────────

const C = {
  GOLD: 'FFC8922A', DARK: 'FF1E1105',
  OK: 'FF5D9E4E', CAUTION: 'FFC89820', WARN: 'FFD94E22',
  CREAM: 'FFF0DDB8', BG: 'FF201305', BG_CARD: 'FF2A1A08',
}
const statusArgb = (s) => s === 'ok' ? C.OK : s === 'caution' ? C.CAUTION : C.WARN
const varroaArgb = (v) => v > 2 ? C.WARN : v > 1.5 ? C.CAUTION : C.OK

function styleHeader(row) {
  row.height = 24
  row.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.GOLD } }
    cell.font = { bold: true, color: { argb: C.DARK }, name: 'Arial', size: 10 }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.border = { bottom: { style: 'thin', color: { argb: C.DARK } } }
  })
}

function styleData(row, even) {
  row.height = 18
  row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: even ? C.BG : C.BG_CARD } }
  row.eachCell((cell) => {
    if (!cell.font?.name) cell.font = { name: 'Arial', size: 10, color: { argb: C.CREAM } }
    cell.alignment = { vertical: 'middle' }
    cell.border = { bottom: { style: 'hair', color: { argb: 'FF3A2010' } } }
  })
}

// ── Excel export ─────────────────────────────────────────────────────────────

/**
 * @param {Record<string, object>} allHiveData - map of hiveId → hiveData
 */
export async function exportToExcel(allHiveData) {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'bee·haviour'
  wb.created = new Date()

  // Summary sheet
  const summary = wb.addWorksheet('Summary', { properties: { tabColor: { argb: C.GOLD } } })
  summary.columns = [
    { key: 'hive', width: 20 }, { key: 'location', width: 26 },
    { key: 'queen', width: 20 }, { key: 'varroa', width: 14 },
    { key: 'vStatus', width: 16 }, { key: 'temp', width: 18 },
    { key: 'tStatus', width: 14 }, { key: 'weight', width: 14 },
    { key: 'wDelta', width: 18 }, { key: 'wStatus', width: 16 },
    { key: 'date', width: 14 },
  ]

  summary.mergeCells('A1:K1')
  Object.assign(summary.getCell('A1'), {
    value: 'bee·haviour — Hive Summary Report',
    font: { bold: true, size: 13, color: { argb: C.GOLD }, name: 'Arial' },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: C.DARK } },
    alignment: { vertical: 'middle', indent: 1 },
  })
  summary.getRow(1).height = 30

  summary.mergeCells('A2:K2')
  Object.assign(summary.getCell('A2'), {
    value: `Exported: ${new Date().toLocaleString()} · All readings from Raspberry Pi sensors`,
    font: { size: 9, italic: true, color: { argb: 'FF7A6040' }, name: 'Arial' },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: C.DARK } },
    alignment: { vertical: 'middle', indent: 1 },
  })
  summary.getRow(2).height = 16
  summary.getRow(3).height = 6

  styleHeader(summary.addRow(['Hive','Location','Queen','Varroa (%)','Varroa Status','Temperature (°C)','Temp Status','Weight (kg)','Weight Δ 7d (kg)','Weight Status','Date']))

  HIVES.forEach((h, idx) => {
    const d = allHiveData[h.id]
    if (!d) return
    const row = summary.addRow([h.name, h.location, h.queen, d.varroa.current, d.varroa.status.toUpperCase(), d.temperature.current, d.temperature.status.toUpperCase(), d.weight.current, d.weight.change7d, d.weight.status.toUpperCase(), new Date().toISOString().split('T')[0]])
    styleData(row, idx % 2 === 0)
    ;[['vStatus', d.varroa.status], ['tStatus', d.temperature.status], ['wStatus', d.weight.status]].forEach(([k, s]) => { row.getCell(k).font = { bold: true, color: { argb: statusArgb(s) }, name: 'Arial', size: 10 } })
    row.getCell('varroa').font = { color: { argb: varroaArgb(d.varroa.current) }, name: 'Arial', size: 10 }
    row.getCell('wDelta').font = { color: { argb: d.weight.change7d < -1 ? C.WARN : d.weight.change7d < 0 ? C.CAUTION : C.OK }, name: 'Arial', size: 10 }
  })

  // Per-hive sheets
  HIVES.forEach((h) => {
    const d = allHiveData[h.id]
    if (!d) return
    const ws = wb.addWorksheet(h.name.slice(0, 31), { properties: { tabColor: { argb: C.GOLD } } })
    ws.columns = [{ key: 'date', width: 14 }, { key: 'day', width: 8 }, { key: 'varroa', width: 14 }, { key: 'temperature', width: 18 }, { key: 'weight', width: 14 }]

    ws.mergeCells('A1:E1')
    Object.assign(ws.getCell('A1'), { value: `${h.name} · 7-Day Sensor Log`, font: { bold: true, size: 12, color: { argb: C.GOLD }, name: 'Arial' }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: C.DARK } }, alignment: { vertical: 'middle', indent: 1 } })
    ws.getRow(1).height = 28
    ws.mergeCells('A2:E2')
    Object.assign(ws.getCell('A2'), { value: `Location: ${h.location} · Queen: ${h.queen}`, font: { size: 9, italic: true, color: { argb: 'FF7A6040' }, name: 'Arial' }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: C.DARK } }, alignment: { vertical: 'middle', indent: 1 } })
    ws.getRow(2).height = 16
    ws.getRow(3).height = 6

    styleHeader(ws.addRow(['Date', 'Day', 'Varroa (%)', 'Temperature (°C)', 'Weight (kg)']))
    buildRows(d).forEach((r, i) => {
      const row = ws.addRow([r.date, r.day, r.varroa, r.temperature, r.weight])
      styleData(row, i % 2 === 0)
      row.getCell('varroa').font = { color: { argb: varroaArgb(r.varroa) }, name: 'Arial', size: 10 }
      const tOk = r.temperature >= 34 && r.temperature <= 36
      const tWarn = r.temperature < 33 || r.temperature > 37
      row.getCell('temperature').font = { color: { argb: tWarn ? C.WARN : tOk ? C.OK : C.CAUTION }, name: 'Arial', size: 10 }
    })
    ws.views = [{ state: 'frozen', ySplit: 4 }]
  })

  const buffer = await wb.xlsx.writeBuffer()
  saveBlob(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `bee-haviour-${new Date().toISOString().split('T')[0]}.xlsx`)
}

// ── CSV export ────────────────────────────────────────────────────────────────

export function exportToCSV(allHiveData) {
  const BOM = '\uFEFF'; 
  const lines = [
    `# bee_haviour export - ${new Date().toLocaleString()}`,
    'Hive,Date,Day,Varroa (%),Varroa Status,Temperature (\u2103),Temp Status,Weight (kg),Weight Diff (7d),Weight Status',
    '',
  ]

  HIVES.forEach((h) => {
    const d = allHiveData[h.id]
    if (!d) return
    buildRows(d).forEach((r) => {
      lines.push([`"${h.name}"`, r.date, r.day, r.varroa, d.varroa.status.toUpperCase(), r.temperature, d.temperature.status.toUpperCase(), r.weight, d.weight.change7d, d.weight.status.toUpperCase()].join(','))
    })
  })
  saveBlob(new Blob([BOM + lines.join('\n')], { type: 'text/csv;charset=utf-8;' }), `bee-haviour-${new Date().toISOString().split('T')[0]}.csv`)
}
