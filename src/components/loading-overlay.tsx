
"use client"

import { cn } from "@/lib/utils"

interface LoadingOverlayProps {
  status?: string;
}

export function LoadingOverlay({ status = "Synchronizing Repository" }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 w-full h-full backdrop-blur-[15px] bg-black/65 flex justify-center items-center z-[9999]">
      <div className="flex flex-col items-center justify-center relative p-[50px] rounded-[24px]">
        {/* Background Ambient Light */}
        <div className="absolute top-[40%] left-1/2 w-[150px] h-[150px] bg-primary/20 blur-[50px] rounded-full z-0 animate-pulseGlow" />

        {/* Animated Data Grid */}
        <div className="grid grid-cols-3 gap-3 mb-10 z-[1]">
          {[...Array(9)].map((_, i) => {
            const delays = [0.0, 0.2, 0.4, 0.2, 0.4, 0.6, 0.4, 0.6, 0.8];
            return (
              <div 
                key={i} 
                className="w-6 h-6 bg-[#2a2a2a] rounded shadow-[0_4px_6px_rgba(0,0,0,0.3)] animate-morphFlip"
                style={{ animationDelay: `${delays[i]}s` }}
              />
            )
          })}
        </div>

        {/* App Name */}
        <div className="text-[2.5rem] font-extrabold tracking-[2px] mb-[10px] z-[1] text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] font-headline">
          PreRP
        </div>

        {/* Dynamic Status Text */}
        <div className="text-[0.9rem] color-[#d1d5db] tracking-[1px] mb-[60px] z-[1] flex font-bold text-muted-foreground uppercase">
          {status}
          <span className="animate-blink ml-1 opacity-0" style={{ animationDelay: '0.2s' }}>.</span>
          <span className="animate-blink ml-0.5 opacity-0" style={{ animationDelay: '0.4s' }}>.</span>
          <span className="animate-blink ml-0.5 opacity-0" style={{ animationDelay: '0.6s' }}>.</span>
        </div>

        {/* Parent Company Footer */}
        <div className="text-[0.75rem] text-[#9ca3af] uppercase tracking-[3px] z-[1] font-bold">
          powered by <span className="text-primary opacity-90">I_NAV</span>
        </div>
      </div>
    </div>
  )
}
