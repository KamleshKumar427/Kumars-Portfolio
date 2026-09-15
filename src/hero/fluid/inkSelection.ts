import { useSyncExternalStore } from 'react'
import { inkConfig } from './inkConfig'

/**
 * The picked ink, shared by both heroes for the whole visit — choose Ruri on
 * "/" and it's still Ruri on "/startups". Module memory only, so a refresh
 * resets it to the first swatch. (No Three.js import: this sits in the main
 * bundle.)
 */
let activeId = inkConfig.swatches[0].id
const listeners = new Set<() => void>()

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  return () => {
    listeners.delete(onChange)
  }
}

const getSnapshot = () => activeId

function setActiveInk(id: string) {
  if (id === activeId) return
  activeId = id
  listeners.forEach((notify) => notify())
}

export function useActiveInk(): [string, (id: string) => void] {
  return [useSyncExternalStore(subscribe, getSnapshot, getSnapshot), setActiveInk]
}

/**
 * "Clear colour" is a one-off request rather than state, so it's a plain event:
 * the button fires it, whichever hero currently owns the water washes it.
 */
const clearListeners = new Set<() => void>()

export function clearInk() {
  clearListeners.forEach((wash) => wash())
}

export function onInkClear(wash: () => void) {
  clearListeners.add(wash)
  return () => {
    clearListeners.delete(wash)
  }
}
