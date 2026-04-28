// src/features/hive/components/HiveSelector.jsx
// The dropdown is rendered via a Portal to document.body so it is never
// clipped by overflow:hidden on ancestor elements.

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import { HIVES } from '@/features/hive'
import { Portal } from '@/lib/Portal'

function OnlineDot({ online, size = 8 }) {
  return (
    <span
      style={{
        display: 'inline-block',
        flexShrink: 0,
        width: size,
        height: size,
        borderRadius: '50%',
        background: online ? '#5d9e4e' : '#d94e22',
        boxShadow: online ? '0 0 6px #5d9e4e' : '0 0 6px #d94e22',
      }}
    />
  )
}

export function HiveSelector({ selectedId, onSelect }) {
  const [open, setOpen] = useState(false)
  const [dropPos, setDropPos] = useState({ top: 0, right: 0 })
  const triggerRef = useRef(null)
  const dropRef = useRef(null)
  const selected = HIVES.find((h) => h.id === selectedId)

  // Calculate fixed position relative to the trigger button
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

  // Close on outside click
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

  return (
    <div style={{ position: 'relative', userSelect: 'none' }}>
      <button
        ref={triggerRef}
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 14px',
          borderRadius: 8,
          border: `1px solid ${open ? 'rgba(200,146,42,0.38)' : 'rgba(200,146,42,0.22)'}`,
          background: '#2a1a08',
          color: '#edc96a',
          fontSize: 'clamp(0.75rem,1vw,0.875rem)',
          fontFamily: 'Jost, sans-serif',
          fontWeight: 400,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'border-color 0.2s',
        }}
      >
        <OnlineDot online={selected?.online} size={8} />
        {selected?.name}
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{ opacity: 0.5, marginLeft: 2, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        >
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <Portal>
          <div
            ref={dropRef}
            style={{
              position: 'fixed',
              top: dropPos.top,
              right: dropPos.right,
              minWidth: 240,
              zIndex: 99999,
              background: '#2a1a08',
              border: '1px solid rgba(200,146,42,0.38)',
              borderRadius: 12,
              padding: 6,
              boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
              animation: 'fadeDown 0.15s ease both',
            }}
          >
            {HIVES.map((hive) => (
              <button
                key={hive.id}
                onClick={() => { onSelect(hive.id); setOpen(false) }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  textAlign: 'left',
                  cursor: 'pointer',
                  marginBottom: 2,
                  transition: 'background 0.15s',
                  background: hive.id === selectedId ? 'rgba(200,146,42,0.10)' : 'transparent',
                  border: `1px solid ${hive.id === selectedId ? 'rgba(200,146,42,0.22)' : 'transparent'}`,
                }}
                onMouseEnter={(e) => { if (hive.id !== selectedId) e.currentTarget.style.background = 'rgba(200,146,42,0.05)' }}
                onMouseLeave={(e) => { if (hive.id !== selectedId) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ paddingTop: 4, flexShrink: 0 }}>
                  <OnlineDot online={hive.online} size={8} />
                </span>
                <div>
                  <p style={{ fontSize: 'clamp(0.75rem,1vw,0.875rem)', color: '#f0ddb8', fontWeight: 400, marginBottom: 2, fontFamily: 'Jost, sans-serif' }}>
                    {hive.name}
                  </p>
                  <p style={{ fontSize: 'clamp(0.625rem,0.85vw,0.75rem)', color: '#7a6040', fontFamily: 'Jost, sans-serif' }}>
                    {hive.location}
                  </p>
                  {!hive.online && (
                    <p style={{ fontSize: '0.625rem', color: '#f07040', marginTop: 3, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif' }}>
                      Offline
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </Portal>
      )}
    </div>
  )
}
