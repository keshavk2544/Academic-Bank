
"use client"

import { useEffect, useRef } from "react"

/**
 * An invisible component that listens for the first user interaction 
 * (click/tap) and requests native browser fullscreen for the entire app.
 * This ensures the app enters fullscreen mode via a valid user gesture 
 * without requiring a visible button.
 */
export function FullscreenToggle() {
  const hasAttempted = useRef(false)

  useEffect(() => {
    // We use 'pointerdown' as it's the most inclusive interaction event 
    // for both desktop (mouse) and mobile (touch).
    const handleFirstInteraction = async () => {
      if (hasAttempted.current) return
      
      // Immediately mark as attempted to ensure this only happens once per page load.
      hasAttempted.current = true
      
      // Remove the listener immediately so it doesn't fire on any future clicks.
      window.removeEventListener('pointerdown', handleFirstInteraction)

      const doc = document as any
      // Check if we are already in fullscreen or if it's explicitly disabled.
      const isFullscreen = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      )

      if (!isFullscreen && doc.fullscreenEnabled !== false) {
        try {
          const docEl = document.documentElement as any
          // Vendor-agnostic request logic.
          const requestFullscreen = 
            docEl.requestFullscreen || 
            docEl.webkitRequestFullscreen || 
            docEl.mozRequestFullScreen || 
            docEl.msRequestFullscreen
          
          if (requestFullscreen) {
            // Call it! This returns a promise. We don't need to await it
            // because we want the original event to continue propagating.
            requestFullscreen.call(docEl).catch((err: any) => {
              // Silently catch failures (e.g. user denied or browser policy).
              console.warn("[FULLSCREEN-AUTO] Request denied or failed", err)
            })
          }
        } catch (error) {
          // Silent fallback.
        }
      }
    }

    // Add the listener. It won't trigger until the user actually interacts.
    window.addEventListener('pointerdown', handleFirstInteraction)

    return () => {
      // Clean up on component unmount (though this is a global layout component).
      window.removeEventListener('pointerdown', handleFirstInteraction)
    }
  }, [])

  // This component renders nothing as the user wants an invisible experience.
  return null
}
