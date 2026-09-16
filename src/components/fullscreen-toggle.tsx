
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
    const handleFirstInteraction = async () => {
      if (hasAttempted.current) return
      
      // Mark as attempted immediately to prevent race conditions.
      hasAttempted.current = true
      
      // Remove all listeners once the gesture is captured.
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('touchstart', handleFirstInteraction)
      window.removeEventListener('pointerdown', handleFirstInteraction)

      const doc = document as any
      const docEl = document.documentElement as any
      
      // Check if we are already in fullscreen or if it's explicitly disabled.
      const isFullscreen = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      )

      if (!isFullscreen) {
        try {
          // Vendor-agnostic request logic for modern and legacy mobile browsers.
          const requestFullscreen = 
            docEl.requestFullscreen || 
            docEl.webkitRequestFullscreen || 
            docEl.mozRequestFullScreen || 
            docEl.msRequestFullscreen
          
          if (requestFullscreen) {
            // Mobile browsers are very sensitive to how this is called.
            // We call it directly from the event stack.
            const fsPromise = requestFullscreen.call(docEl)
            
            if (fsPromise instanceof Promise) {
              fsPromise.catch((err: any) => {
                console.warn("[FULLSCREEN-MOBILE] Request denied by browser policy", err)
              })
            }
          }
        } catch (error) {
          // Silent fallback for non-supporting browsers (e.g. standard iPhone Safari).
        }
      }
    }

    // Add multiple listeners to capture the first tap accurately on all devices.
    window.addEventListener('click', handleFirstInteraction, { once: true, capture: true })
    window.addEventListener('touchstart', handleFirstInteraction, { once: true, capture: true })
    window.addEventListener('pointerdown', handleFirstInteraction, { once: true, capture: true })

    return () => {
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('touchstart', handleFirstInteraction)
      window.removeEventListener('pointerdown', handleFirstInteraction)
    }
  }, [])

  // This component renders nothing as the user wants an invisible experience.
  return null
}
