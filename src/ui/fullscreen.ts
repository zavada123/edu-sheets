import { useCallback, useEffect, useRef, useState } from "react"

/** While the trainer covers the page, the page under it does not scroll and keeps no space for a scrollbar. */
export const PAGE_FULL_CLASS = "es-page-full"

const isEditing = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement && (target.isContentEditable || target.tagName === "INPUT" || target.tagName === "TEXTAREA")

/**
 * Full screen for the trainer. The trainer covers the page (a fixed layer), so it works on an iPhone too, and where
 * the browser can, the whole page goes to the browser's full screen. Not the trainer alone: Univer shows its menus
 * and tooltips in `document.body`, outside the trainer, and they must stay visible. Esc or the button leaves it.
 */
export const useFullScreen = (): Readonly<{ full: boolean; toggle: () => void }> => {
  const [full, setFull] = useState(false)

  const leave = useCallback(() => {
    setFull(false)
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined)
  }, [])

  const enter = useCallback(() => {
    setFull(true)
    const page = document.documentElement
    if (typeof page.requestFullscreen === "function" && document.fullscreenEnabled && !document.fullscreenElement)
      void page.requestFullscreen().catch(() => undefined)
  }, [])

  useEffect(() => {
    if (!full) return undefined
    const page = document.documentElement
    page.classList.add(PAGE_FULL_CLASS)
    // The browser left its full screen (Esc, a gesture): the trainer stops covering the page too.
    const onChange = () => {
      if (!document.fullscreenElement) setFull(false)
    }
    // Esc while typing in a cell cancels the edit in Univer; only an Esc outside an editor leaves the full screen.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isEditing(e.target)) leave()
    }
    document.addEventListener("fullscreenchange", onChange)
    document.addEventListener("keydown", onKey)
    return () => {
      page.classList.remove(PAGE_FULL_CLASS)
      document.removeEventListener("fullscreenchange", onChange)
      document.removeEventListener("keydown", onKey)
    }
  }, [full, leave])

  // The trainer leaves the page: the browser's full screen it opened ends with it.
  const isFull = useRef(full)
  isFull.current = full
  useEffect(
    () => () => {
      if (isFull.current && document.fullscreenElement) void document.exitFullscreen().catch(() => undefined)
    },
    []
  )

  return { full, toggle: full ? leave : enter }
}
