
"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isCoveringEyes, setIsCoveringEyes] = useState(false)
  const [isSad, setIsSad] = useState(false)
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Handle eye tracking for email
  useEffect(() => {
    if (!isCoveringEyes && !isSad && email.length > 0) {
      const maxMoveX = 12
      const moveX = Math.min((email.length / 30) * maxMoveX * 2, maxMoveX * 2) - maxMoveX
      setEyeOffset({ x: moveX, y: 8 })
    } else if (email.length === 0 && !isCoveringEyes && !isSad) {
      setEyeOffset({ x: 0, y: 0 })
    }
  }, [email, isCoveringEyes, isSad])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setIsSad(false)
    setIsCoveringEyes(false)
    
    // Simulate login logic
    setTimeout(() => {
      // For demo, we just go to dashboard. 
      // If we wanted to show the 'sad' state, we would set isSad(true) here instead.
      localStorage.setItem("userRole", "student")
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4 font-sans selection:bg-primary selection:text-black">
      {/* Branding Header */}
      <div className="text-center mb-40 z-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-6xl font-headline font-bold tracking-tight mb-2">PreRP</h1>
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold">
          powered by <span className="text-primary">I_NAV</span>
        </p>
      </div>

      <div className="relative w-full max-w-[350px]">
        {/* Yeti Character */}
        <div className={cn(
          "absolute bottom-[calc(100%-10px)] left-1/2 -translate-x-1/2 w-[200px] h-[150px] z-0 transition-all duration-500",
          isCoveringEyes && "covering-eyes",
          isSad && "sad"
        )}>
          {/* Head */}
          <div className="relative w-[150px] h-[140px] bg-white rounded-[50%_50%_45%_45%] mx-auto shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-10">
            {/* Ears */}
            <div className="absolute top-5 -left-2 w-[30px] h-[30px] bg-white rounded-full -z-10" />
            <div className="absolute top-5 -right-2 w-[30px] h-[30px] bg-white rounded-full -z-10" />
            
            {/* Eyes */}
            <div className="absolute top-[50px] left-10 w-[22px] h-[22px] bg-[#1a1a1a] rounded-full overflow-hidden">
              <div 
                className="absolute w-1.5 h-1.5 bg-white rounded-full top-1 left-2 transition-transform duration-100 ease-out"
                style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` }}
              />
            </div>
            <div className="absolute top-[50px] right-10 w-[22px] h-[22px] bg-[#1a1a1a] rounded-full overflow-hidden">
              <div 
                className="absolute w-1.5 h-1.5 bg-white rounded-full top-1 left-2 transition-transform duration-100 ease-out"
                style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` }}
              />
            </div>

            {/* Mouth */}
            <div className={cn(
              "absolute top-[85px] left-1/2 -translate-x-1/2 w-[60px] h-[25px] bg-[#1a1a1a] rounded-b-[30px] overflow-hidden transition-all duration-300",
              isSad && "h-[10px] top-[95px] rounded-t-[30px] rounded-b-none"
            )}>
              {!isSad && <div className="absolute bottom-0 left-[10px] w-10 h-3 bg-[#e74c3c] rounded-t-full" />}
            </div>
          </div>

          {/* Scarf */}
          <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-[170px] h-[45px] bg-primary rounded-[20px] z-20" />

          {/* Arms */}
          <div className={cn(
            "absolute bottom-[-40px] left-[15px] w-[45px] h-[100px] bg-white rounded-[25px] shadow-[0_5px_10px_rgba(0,0,0,0.3)] z-30 origin-bottom transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]",
            isCoveringEyes ? "translate-y-[-95px] rotate-[35deg]" : "rotate-[-15deg]"
          )} />
          <div className={cn(
            "absolute bottom-[-40px] right-[15px] w-[45px] h-[100px] bg-white rounded-[25px] shadow-[0_5px_10px_rgba(0,0,0,0.3)] z-30 origin-bottom transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]",
            isCoveringEyes ? "translate-y-[-95px] rotate-[-35deg]" : "rotate-[15deg]"
          )} />
        </div>

        {/* Form Box */}
        <div className="bg-[#1c1c1c] p-8 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative z-10 border border-white/5">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <input
                type="text"
                placeholder="Student ID / Email"
                className="w-full h-14 bg-[#2a2a2a] border-2 border-transparent rounded-xl px-5 text-sm transition-all focus:border-primary focus:bg-[#222222] outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => {
                  setIsSad(false)
                  setIsCoveringEyes(false)
                }}
                onBlur={() => setEyeOffset({ x: 0, y: 0 })}
                required
              />
            </div>

            <div className="space-y-1">
              <input
                type="password"
                placeholder="Password"
                className="w-full h-14 bg-[#2a2a2a] border-2 border-transparent rounded-xl px-5 text-sm transition-all focus:border-primary focus:bg-[#222222] outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => {
                  setIsSad(false)
                  setIsCoveringEyes(true)
                  setEyeOffset({ x: 0, y: -4 })
                }}
                onBlur={() => {
                  setIsCoveringEyes(false)
                  setEyeOffset({ x: 0, y: 0 })
                }}
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-none bg-[#2a2a2a] accent-primary transition-all" />
                <span className="group-hover:text-white transition-colors">Remember me</span>
              </label>
              
              <button 
                type="submit"
                disabled={isLoggingIn}
                className="bg-primary text-black h-11 px-8 rounded-full font-bold text-sm transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-[0_10px_20px_rgba(250,204,21,0.2)]"
              >
                {isLoggingIn ? "Initializing..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <p className="mt-12 text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
        &copy; 2025 PreRP Technologies. All Rights Reserved.
      </p>
    </div>
  )
}
