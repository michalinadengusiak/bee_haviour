// src/hooks/useDropdownPosition.js
// Calculates the absolute position of a dropdown relative to its trigger element.
// Because the dropdown is portalled to document.body, we need real screen coords
// (getBoundingClientRect) rather than CSS positioning.

import { useState, useCallback, useLayoutEffect } from 'react'

/**
 * @param {React.RefObject} triggerRef - ref attached to the trigger button
 * @param {boolean} open - whether the dropdown is currently open
 * @param {'left'|'right'} align - which edge of the trigger to align to
 * @returns {{ top: number, left: number, minWidth: number }}
 */
export function useDropdownPosition(triggerRef, open, align = 'right') {
  const [pos, setPos] = useState({ top: 0, left: 0, minWidth: 0 })

  const recalculate = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const gap = 6
    setPos({
      top: rect.bottom + gap + window.scrollY,
      left: align === 'right'
        ? rect.right + window.scrollX  // will be transformed to right-align
        : rect.left + window.scrollX,
      minWidth: rect.width,
      rectRight: rect.right,
      rectLeft: rect.left,
    })
  }, [triggerRef, align])

  useLayoutEffect(() => {
    if (open) recalculate()
  }, [open, recalculate])

  // Recalculate on scroll/resize so the dropdown follows the trigger
  useLayoutEffect(() => {
    if (!open) return
    window.addEventListener('scroll', recalculate, true)
    window.addEventListener('resize', recalculate)
    return () => {
      window.removeEventListener('scroll', recalculate, true)
      window.removeEventListener('resize', recalculate)
    }
  }, [open, recalculate])

  return pos
}
