// src/lib/Portal.jsx
// Renders children directly into document.body via a React portal.
// This is the correct fix for dropdowns being clipped by overflow:hidden parents
// or lost in z-index stacking contexts. The dropdown escapes the DOM tree entirely
// and sits at the top level, always visible.

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export function Portal({ children }) {
  const elRef = useRef(null)
  if (!elRef.current) {
    elRef.current = document.createElement('div')
  }

  useEffect(() => {
    const el = elRef.current
    document.body.appendChild(el)
    return () => {
      document.body.removeChild(el)
    }
  }, [])

  return createPortal(children, elRef.current)
}
