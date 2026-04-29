// src/features/export/components/ExportButton.jsx
// The dropdown is rendered via a Portal to document.body so it is never
// clipped by overflow:hidden on ancestor elements.

import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react'
import { useExport } from '@/features/export'
import { Portal } from '@/lib/Portal'

const DownloadIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const SpinnerIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
  </svg>
)

export function ExportButton({ allHiveData }) {
  const [open, setOpen] = useState(false)
  const [dropPos, setDropPos] = useState({ top: 0, right: 0 })
  const triggerRef = useRef(null)
  const dropRef = useRef(null)
  const { exportXlsx, exportCsv, isLoading, loadingFormat, isDone, doneFormat } = useExport(allHiveData)

  const recalc = useCallback(() => {
    if (!triggerRef.current) return
    const r = triggerRef.current.getBoundingClientRect()
    setDropPos({
      top: r.bottom + 6,
      right: window.innerWidth - r.right,
    })
  }, [])

  useLayoutEffect(() => {
    if (open) recalc()
  }, [open, recalc])

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (!triggerRef.current?.contains(e.target) && !dropRef.current?.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    window.addEventListener('scroll', recalc, true)
    window.addEventListener('resize', recalc)
    return () => {
      document.removeEventListener('mousedown', handler)
      window.removeEventListener('scroll', recalc, true)
      window.removeEventListener('resize', recalc)
    }
  }, [open, recalc])

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  const isDoneState = isDone
  const isLoadingState = isLoading

  return (
    <div style={{ position: 'relative' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <button
        ref={triggerRef}
        onClick={() => !isLoadingState && setOpen((o) => !o)}
        disabled={isLoadingState}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 14px',
          borderRadius: 8,
          border: `1px solid ${isDoneState ? 'rgba(93,158,78,0.35)' : 'rgba(200,146,42,0.22)'}`,
          background: isDoneState ? 'rgba(93,158,78,0.10)' : 'rgba(200,146,42,0.06)',
          color: isDoneState ? '#80c46e' : '#edc96a',
          fontSize: 'clamp(0.625rem,0.85vw,0.75rem)',
          fontFamily: 'Jost, sans-serif',
          fontWeight: 400,
          cursor: isLoadingState ? 'wait' : 'pointer',
          whiteSpace: 'nowrap',
          letterSpacing: '0.03em',
          transition: 'all 0.2s',
        }}
      >
        {isLoadingState ? <SpinnerIcon /> : isDoneState ? null : <DownloadIcon />}
        {isLoadingState
          ? `Exporting ${loadingFormat?.toUpperCase()}…`
          : isDoneState
          ? `✓ ${doneFormat?.toUpperCase()} Downloaded`
          : 'Export Data'}
        {!isLoadingState && !isDoneState && (
          <svg
            width="9" height="9" viewBox="0 0 10 10" fill="none"
            style={{ opacity: 0.5, marginLeft: 2, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          >
            <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {open && (
        <Portal>
          <div
            ref={dropRef}
            style={{
              position: 'fixed',
              top: dropPos.top,
              right: dropPos.right,
              minWidth: 210,
              zIndex: 99999,
              background: '#2a1a08',
              border: '1px solid rgba(200,146,42,0.38)',
              borderRadius: 12,
              padding: 6,
              boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
              animation: 'fadeDown 0.15s ease both',
            }}
          >
            {[
              {
                emoji: '📊',
                label: 'Excel (.xlsx)',
                sub: 'Formatted, colour-coded, per-hive sheets',
                action: () => { setOpen(false); exportXlsx() },
              },
              {
                emoji: '📄',
                label: 'CSV (.csv)',
                sub: 'Plain text — works in any spreadsheet app',
                action: () => { setOpen(false); exportCsv() },
              },
            ].map((opt, i) => (
              <div key={opt.label}>
                {i > 0 && (
                  <div style={{ height: 1, background: 'rgba(200,146,42,0.10)', margin: '4px 4px' }} />
                )}
                <button
                  onClick={opt.action}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    textAlign: 'left',
                    cursor: 'pointer',
                    background: 'transparent',
                    border: '1px solid transparent',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(200,146,42,0.08)'
                    e.currentTarget.style.borderColor = 'rgba(200,146,42,0.12)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'transparent'
                  }}
                >
                  <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{opt.emoji}</span>
                  <div>
                    <p style={{ fontSize: 'clamp(0.75rem,1vw,0.875rem)', color: '#f0ddb8', fontWeight: 500, marginBottom: 3, fontFamily: 'Jost, sans-serif' }}>
                      {opt.label}
                    </p>
                    <p style={{ fontSize: 'clamp(0.625rem,0.85vw,0.75rem)', color: '#7a6040', lineHeight: 1.4, fontFamily: 'Jost, sans-serif' }}>
                      {opt.sub}
                    </p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </Portal>
      )}
    </div>
  )
}
