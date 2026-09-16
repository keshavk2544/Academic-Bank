"use client"

import { useState, useEffect } from "react"
import { Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

/**
 * A subtle UI control that toggles native browser fullscreen mode.
 * Synchronizes with the actual browser state using event listeners.
 */
export function FullscreenToggle() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Check if fullscreen is supported in this browser
    const checkSupport = () => {
      const doc = document as any
      return !!(
        doc.fullscreenEnabled ||
        doc.webkitFullscreenEnabled ||
        doc.mozFullScreenEnabled ||
        doc.msFullscreenEnabled
      )
    }

    if (!checkSupport()) {
      setIsSupported(false)
      return
    }

    // Function to synchronize local state with actual browser fullscreen state
    const handleFullscreenChange = () => {
      const doc = document as any
      setIsFullscreen(!!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      ))
    }

    // Register listeners for all major browser engines
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
    document.addEventListener("mozfullscreenchange", handleFullscreenChange)
    document.addEventListener("MSFullscreenChange", handleFullscreenChange)

    // Initial sync
    handleFullscreenChange()

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange)
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = async () => {
    try {
      const docEl = document.documentElement as any
      const doc = document as any

      if (!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement)) {
        // Enter Fullscreen
        const requestFullscreen = 
          docEl.requestFullscreen || 
          docEl.webkitRequestFullscreen || 
          docEl.mozRequestFullScreen || 
          docEl.msRequestFullscreen
        
        if (requestFullscreen) {
          await requestFullscreen.call(docEl)
        }
      } else {
        // Exit Fullscreen
        const exitFullscreen = 
          doc.exitFullscreen || 
          doc.webkitExitFullscreen || 
          doc.mozCancelFullScreen || 
          doc.msExitFullscreen
        
        if (exitFullscreen) {
          await exitFullscreen.call(doc)
        }
      }
    } catch (error) {
      console.error("[FULLSCREEN-ERROR]", error)
      toast({
        variant: "destructive",
        title: "System Error",
        description: "Fullscreen mode isn't available in this browser pulse.",
      })
    }
  }

  if (!isSupported) return null

  return (
    <button
      onClick={toggleFullscreen}
      className={cn(
        "fixed top-6 left-6 z-[999] w-10 h-10 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl flex items-center justify-center text-zinc-500 transition-all duration-500 hover:border-primary hover:text-primary hover:scale-110 active:scale-95 group shadow-2xl overflow-hidden",
        isFullscreen && "border-primary/50 text-primary bg-primary/10 shadow-[0_0_20px_rgba(250,204,21,0.2)]"
      )}
      aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {isFullscreen ? (
        <Minimize2 className="w-4 h-4 relative z-10" />
      ) : (
        <Maximize2 className="w-4 h-4 relative z-10" />
      )}
      
      {/* Tooltip hint */}
      <span className="absolute left-12 px-2 py-1 rounded-lg bg-zinc-900 border border-white/10 text-[9px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
        {isFullscreen ? "Collapse View" : "Expand Interface"}
      </span>
    </button>
  )
}
