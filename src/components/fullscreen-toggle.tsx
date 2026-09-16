
"use client"

import { useEffect, useRef } from "react"

/**
 * An invisible component that listens for the first user interaction 
 * (click/tap/touchstart) and requests native browser fullscreen for the entire app.
 * This ensures the app enters fullscreen mode via a valid user gesture 
 * with maximum compatibility across mobile and desktop browsers.
 */
export function FullscreenToggle() {
  const hasAttempted = useRef(false)

  useEffect(() => {
    // We use a broader set of events to ensure mobile browsers recognize the gesture.
    const handleFirstInteraction = (e: Event) => {
      if (hasAttempted.current) return
      
      const doc = document as any
      const docEl = document.documentElement as any
      
      // Check if we are already in fullscreen or if it's explicitly disabled.
      const isFullscreen = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      )

      if (isFullscreen) {
        // If already fullscreen (e.g. from a previous reload or PWA state), 
        // we don't need to do anything, but we stop listening.
        hasAttempted.current = true
        cleanup();
        return;
      }

      // Mark as attempted immediately to prevent race conditions.
      hasAttempted.current = true
      cleanup();

      // Mobile browsers are very sensitive to how this is called.
      // It MUST be called synchronously within the event handler for most browsers to trust the gesture.
      try {
        const requestFullscreen = 
          docEl.requestFullscreen || 
          docEl.webkitRequestFullscreen || 
          docEl.webkitEnterFullscreen || // Specific for some legacy mobile variants
          docEl.mozRequestFullScreen || 
          docEl.msRequestFullscreen
        
        if (requestFullscreen) {
          // Execute the request directly from the event callback
          const fsPromise = requestFullscreen.call(docEl)
          
          if (fsPromise instanceof Promise) {
            fsPromise.catch((err: any) => {
              console.warn("[FULLSCREEN-MOBILE] Request denied by browser policy", err)
            })
          }
        }
      } catch (error) {
        // Silent fallback for non-supporting browsers (e.g. standard iPhone Safari).
        console.warn("[FULLSCREEN-ERROR] System does not support root fullscreen API", error)
      }
    }

    const cleanup = () => {
      window.removeEventListener('click', handleFirstInteraction, true)
      window.removeEventListener('touchstart', handleFirstInteraction, true)
      window.removeEventListener('touchend', handleFirstInteraction, true)
      window.removeEventListener('pointerdown', handleFirstInteraction, true)
      window.removeEventListener('mousedown', handleFirstInteraction, true)
    }

    // Add multiple listeners to capture the first interaction accurately on all devices.
    // Using capture: true ensures we get the event before it's potentially stopped by other components.
    window.addEventListener('click', handleFirstInteraction, { once: true, capture: true })
    window.addEventListener('touchstart', handleFirstInteraction, { once: true, capture: true })
    window.addEventListener('touchend', handleFirstInteraction, { once: true, capture: true })
    window.addEventListener('pointerdown', handleFirstInteraction, { once: true, capture: true })
    window.addEventListener('mousedown', handleFirstInteraction, { once: true, capture: true })

    return () => cleanup();
  }, [])

  // This component renders nothing as the user wants an invisible experience.
  return null
}
