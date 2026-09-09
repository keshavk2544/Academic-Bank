
"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const CORRECT_SEQUENCE = "12346"
const LOCKOUT_SECONDS = 360 // 6 minutes

export default function AdminLoginPage() {
  const router = useRouter()
  const [currentSequence, setCurrentSequence] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0)
  const [guardianState, setGuardianState] = useState<'normal' | 'eating' | 'happy' | 'angry'>('normal')
  const [feedback, setFeedback] = useState("Feed 5 biscuits in order")
  const [eatenBiscuits, setEatenBiscuits] = useState<Set<number>>(new Set())

  // Lockout Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (lockoutTimeLeft > 0) {
      interval = setInterval(() => {
        setLockoutTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (lockoutTimeLeft === 0 && failedAttempts >= 3) {
      setFailedAttempts(0)
      setEatenBiscuits(new Set())
      setCurrentSequence("")
      setGuardianState('normal')
      setFeedback("Feed 5 biscuits in order")
    }
    return () => clearInterval(interval)
  }, [lockoutTimeLeft, failedAttempts])

  const checkSequence = useCallback((sequence: string) => {
    if (sequence === CORRECT_SEQUENCE) {
      setFailedAttempts(0)
      setGuardianState('happy')
      setFeedback("YUM! ACCESS GRANTED")
      setTimeout(() => {
        localStorage.setItem("userRole", "admin")
        router.push("/admin")
      }, 1500)
    } else {
      const nextFails = failedAttempts + 1
      setFailedAttempts(nextFails)
      
      if (nextFails >= 3) {
        setGuardianState('angry')
        setFeedback("SYSTEM LOCKED. PLEASE WAIT.")
        setLockoutTimeLeft(LOCKOUT_SECONDS)
      } else {
        setGuardianState('angry')
        setFeedback(`WRONG! STRIKE ${nextFails}/3`)
        setTimeout(() => {
          setGuardianState('normal')
          setCurrentSequence("")
          setEatenBiscuits(new Set())
          setFeedback("Feed 5 biscuits in order")
          setIsProcessing(false)
        }, 2000)
      }
    }
  }, [failedAttempts, router])

  const feedBiscuit = (num: number) => {
    if (isProcessing || lockoutTimeLeft > 0 || eatenBiscuits.has(num)) return

    setEatenBiscuits(prev => new Set(prev).add(num))
    setGuardianState('eating')
    
    setTimeout(() => {
      setGuardianState('normal')
    }, 400)

    const nextSequence = currentSequence + num
    setCurrentSequence(nextSequence)

    if (nextSequence.length === 5) {
      setIsProcessing(true)
      setTimeout(() => checkSequence(nextSequence), 500)
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <div className="admin-login-body fixed inset-0 flex items-center justify-center selection:bg-transparent">
      <style jsx>{`
        .admin-login-body {
          background: radial-gradient(circle at 50% 30%, #7a6a58 0%, #3a322a 60%, #1a1612 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          user-select: none;
        }

        .mobile-container {
          position: relative;
          width: 100%;
          max-width: 400px;
          height: 800px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .spotlight {
          position: absolute;
          top: -50px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255, 230, 150, 0.4) 0%, transparent 70%);
          z-index: 0;
          pointer-events: none;
        }

        .interaction-zone {
          position: relative;
          width: 350px;
          height: 450px;
          z-index: 10;
        }

        .biscuit {
          position: absolute;
          width: 55px;
          height: 55px;
          background: #e6b36a;
          border: 3px solid #c88c3a;
          border-radius: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.8rem;
          font-weight: 900;
          color: #4a2e0b;
          cursor: pointer;
          box-shadow: 0 8px 15px rgba(0,0,0,0.4), inset 0 0 10px rgba(255,255,255,0.4);
          transition: transform 0.3s ease, opacity 0.3s ease, filter 0.2s;
          z-index: 20;
        }

        .biscuit::before, .biscuit::after {
          content: ''; position: absolute; width: 4px; height: 4px; background: #c88c3a; border-radius: 50%;
        }
        .biscuit::before { top: 6px; left: 6px; box-shadow: 37px 0 0 #c88c3a; }
        .biscuit::after { bottom: 6px; left: 6px; box-shadow: 37px 0 0 #c88c3a; }

        .biscuit:hover { filter: brightness(1.1); transform: scale(1.1); }
        .biscuit:active { transform: scale(0.9); }

        .b-0 { top: 160px; left: -5px; animation: float1 3.2s infinite alternate; }
        .b-1 { top: 80px; left: 30px; animation: float2 2.8s infinite alternate; }
        .b-2 { top: 20px; left: 85px; animation: float3 3.5s infinite alternate; }
        .b-3 { top: -10px; left: 145px; animation: float1 3.0s infinite alternate; }
        .b-4 { top: 20px; left: 205px; animation: float2 3.3s infinite alternate; }
        .b-5 { top: 80px; left: 260px; animation: float3 2.9s infinite alternate; }
        .b-6 { top: 160px; left: 295px; animation: float1 3.1s infinite alternate; }

        @keyframes float1 { 0% { margin-top: 0; transform: rotate(-5deg); } 100% { margin-top: -8px; transform: rotate(5deg); } }
        @keyframes float2 { 0% { margin-top: 0; transform: rotate(5deg); } 100% { margin-top: -10px; transform: rotate(-5deg); } }
        @keyframes float3 { 0% { margin-top: 0; } 100% { margin-top: -12px; } }

        .biscuit.eaten {
          animation: flyToMouth 0.4s forwards cubic-bezier(0.5, 0, 0.2, 1) !important;
          pointer-events: none;
        }

        @keyframes flyToMouth {
          100% { top: 200px; left: 145px; transform: scale(0) rotate(180deg); opacity: 0; }
        }

        .biscuit.locked-out {
          opacity: 0 !important;
          transform: scale(0) !important;
          pointer-events: none;
          animation: none !important;
        }

        .character {
          position: absolute;
          top: 130px;
          left: 75px;
          width: 200px;
          height: 180px;
          background: radial-gradient(circle at 30% 30%, #ffffff 0%, #e0e0e0 80%);
          border-radius: 50% 50% 45% 45%;
          box-shadow: 0 20px 40px rgba(0,0,0,0.6), inset -10px -20px 20px rgba(0,0,0,0.1);
          z-index: 10;
          transition: all 0.3s ease;
        }

        .ear { position: absolute; width: 40px; height: 40px; background: #ffffff; border-radius: 50%; top: 10px; z-index: -1; }
        .ear.left { left: 10px; box-shadow: inset -5px -5px 10px rgba(0,0,0,0.1); }
        .ear.right { right: 10px; box-shadow: inset -5px -5px 10px rgba(0,0,0,0.1); }

        .paw { position: absolute; width: 50px; height: 40px; background: #ffffff; border-radius: 50%; bottom: -10px; z-index: 15; box-shadow: 0 5px 10px rgba(0,0,0,0.3); }
        .paw.left { left: 20px; }
        .paw.right { right: 20px; }

        .eye { position: absolute; top: 60px; width: 26px; height: 32px; background: #1a1a1a; border-radius: 50%; transition: all 0.3s; }
        .eye::after { content: ''; position: absolute; top: 4px; left: 6px; width: 8px; height: 10px; background: #fff; border-radius: 50%; }
        .eye.left { left: 50px; }
        .eye.right { right: 50px; }

        .mouth { position: absolute; top: 100px; left: 65px; width: 70px; height: 40px; background: #1a1a1a; border-radius: 0 0 50px 50px; overflow: hidden; transition: all 0.2s; }
        .mouth::after { content: ''; position: absolute; bottom: 0; left: 15px; width: 40px; height: 20px; background: #e74c3c; border-radius: 50px 50px 0 0; }

        .eating .mouth { animation: chomp 0.4s infinite alternate; }
        @keyframes chomp { 0% { height: 40px; top: 100px; } 100% { height: 10px; top: 115px; border-radius: 20px; } }

        .happy.character { box-shadow: 0 0 60px rgba(250, 204, 21, 0.6); background: #fffde7; animation: jump 0.5s ease infinite alternate; }
        .happy.character .mouth { border-radius: 0 0 60px 60px; height: 50px; }
        @keyframes jump { 0% { transform: translateY(0); } 100% { transform: translateY(-15px); } }

        .angry.character { background: #ffcccc; box-shadow: 0 0 40px rgba(255, 0, 0, 0.4); animation: shake 0.4s ease infinite; }
        .angry.character .eye { height: 12px; top: 75px; background: #8b0000; }
        .angry.character .eye::after { display: none; }
        .angry.character .mouth { height: 15px; top: 115px; border-radius: 20px 20px 0 0; background: #8b0000; }
        .angry.character .mouth::after { display: none; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }

        .timer-bubble {
          position: absolute;
          top: 75px;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          background: #ff4d4d;
          color: #ffffff;
          font-size: 1.5rem;
          font-weight: 900;
          padding: 8px 18px;
          border-radius: 20px;
          box-shadow: 0 10px 20px rgba(255,0,0,0.5);
          opacity: 0;
          pointer-events: none;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 30;
        }

        .timer-bubble::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 10px 10px 0;
          border-style: solid;
          border-color: #ff4d4d transparent transparent transparent;
        }

        .timer-bubble.visible {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
          animation: pulseTimer 1s infinite alternate;
        }

        @keyframes pulseTimer {
          0% { box-shadow: 0 5px 15px rgba(255,0,0,0.5); }
          100% { box-shadow: 0 5px 25px rgba(255,0,0,0.8); }
        }

        .plate { position: absolute; top: 300px; left: 45px; width: 260px; height: 60px; background: radial-gradient(ellipse, #fcfcfc 0%, #d4d4d4 100%); border-radius: 50%; box-shadow: 0 15px 20px rgba(0,0,0,0.5), inset 0 -5px 10px rgba(255,255,255,0.8); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 5; }
        .plate-text { color: #b8860b; font-size: 0.8rem; font-weight: bold; letter-spacing: 1px; margin-top: 5px; }

        .status-area { position: absolute; top: 400px; width: 100%; display: flex; flex-direction: column; align-items: center; }
        .dots-container { display: flex; gap: 15px; margin-bottom: 15px; }
        .dot { width: 35px; height: 35px; border: 2px solid #e6b36a; border-radius: 50%; transition: all 0.3s; box-shadow: inset 0 0 10px rgba(0,0,0,0.5); }
        .dot.filled { background: #e6b36a; box-shadow: 0 0 15px rgba(230, 179, 106, 0.6); transform: scale(1.1); }
        .helper-text { font-size: 0.75rem; color: #a0a0a0; letter-spacing: 1px; text-transform: uppercase; font-weight: bold; }
      `}</style>

      <div className="mobile-container">
        <div className="spotlight"></div>

        <div className="interaction-zone">
          <div className={cn("timer-bubble", lockoutTimeLeft > 0 && "visible")}>
            {formatTime(lockoutTimeLeft)}
          </div>

          {[0, 1, 2, 3, 4, 5, 6].map(num => (
            <div 
              key={num}
              onClick={() => feedBiscuit(num)}
              className={cn(
                "biscuit", 
                `b-${num}`, 
                eatenBiscuits.has(num) && "eaten",
                lockoutTimeLeft > 0 && "locked-out"
              )}
            >
              {num}
            </div>
          ))}

          <div className={cn("character", guardianState)}>
            <div className="ear left"></div>
            <div className="ear right"></div>
            <div className="eye left"></div>
            <div className="eye right"></div>
            <div className="mouth"></div>
            <div className="paw left"></div>
            <div className="paw right"></div>
          </div>

          <div className="plate">
            <div className="plate-text">FEED ME</div>
          </div>

          <div className="status-area">
            <div className="dots-container">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className={cn("dot", currentSequence.length > i && "filled")} />
              ))}
            </div>
            <div className="helper-text" style={{ color: guardianState === 'angry' ? '#ff4d4d' : guardianState === 'happy' ? '#facc15' : '#a0a0a0' }}>
              {feedback}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
