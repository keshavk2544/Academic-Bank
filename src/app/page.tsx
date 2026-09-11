
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { LoadingOverlay } from "@/components/loading-overlay"
import { Shield, RotateCw, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [qid, setQid] = useState("")
  const [password, setPassword] = useState("")
  const [captchaInput, setCaptchaInput] = useState("")
  const [captchaData, setCaptchaData] = useState<{ image: string } | null>(null)
  const [transactionId, setTransactionId] = useState("")
  const [initStatus, setInitializationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState("")
  
  const [isCoveringEyes, setIsCoveringEyes] = useState(false)
  const [isSad, setIsSad] = useState(false)
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const fetchCaptcha = async () => {
    setInitializationStatus('loading')
    setErrorMessage("")
    setCaptchaData(null)
    
    try {
      // Direct call to our proxy API
      const res = await fetch('/api/auth/erp-captcha', { cache: 'no-store' });
      const data = await res.json();
      
      if (data.success && data.captcha) {
        setCaptchaData({ image: data.captcha });
        setTransactionId(data.transactionId);
        setInitializationStatus('success');
      } else {
        const error = data.message || 'Initialization failed';
        setErrorMessage(error);
        setInitializationStatus('error');
      }
    } catch (e) {
      setErrorMessage("Network pulse interrupted");
      setInitializationStatus('error');
    }
  }

  useEffect(() => {
    fetchCaptcha()
  }, [])

  const handleInputTrack = (val: string) => {
    if (!isCoveringEyes && !isSad) {
      const maxMoveX = 12
      const moveX = Math.min((val.length / 20) * maxMoveX * 2, maxMoveX * 2) - maxMoveX
      setEyeOffset({ x: moveX, y: 8 })
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!transactionId) return;

    setIsLoggingIn(true)
    setIsSad(false)
    setIsCoveringEyes(false)
    
    try {
      const response = await fetch('/api/auth/erp-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: qid, 
          password: password, 
          captcha: captchaInput,
          transactionId: transactionId
        })
      })

      const data = await response.json()

      if (data.success) {
        router.push("/dashboard")
      } else {
        setIsSad(true)
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: data.message || "Invalid credentials or CAPTCHA.",
        })
        fetchCaptcha()
        setCaptchaInput("")
        setIsLoggingIn(false)
      }
    } catch (err) {
      setIsSad(true)
      toast({
        variant: "destructive",
        title: "System Error",
        description: "Authentication pulse interrupted.",
      })
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4 font-sans selection:bg-primary selection:text-black relative overflow-hidden">
      {isLoggingIn && <LoadingOverlay status="Verifying QUMS Pulse" />}
      
      <button 
        onClick={() => router.push("/admin-login")}
        className="absolute top-8 right-8 w-11 h-11 bg-[#1c1c1c] border-2 border-[#2a2a2a] rounded-full flex items-center justify-center text-[#888888] transition-all hover:border-primary hover:text-primary hover:scale-105 hover:shadow-[0_0_15px_rgba(250,204,21,0.2)] z-50"
      >
        <Shield className="w-5 h-5" />
      </button>

      <div className="text-center mb-40 z-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-6xl font-headline font-bold tracking-tight mb-2 text-white">PreRP</h1>
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold">
          powered by <span className="text-primary">I_NAV</span>
        </p>
      </div>

      <div className="relative w-full max-w-[350px]">
        <div className={cn(
          "absolute bottom-[calc(100%-10px)] left-1/2 -translate-x-1/2 w-[200px] h-[150px] z-0 transition-all duration-500",
          isCoveringEyes && "covering-eyes",
          isSad && "sad"
        )}>
          <div className="relative w-[150px] h-[140px] bg-white rounded-[50%_50%_45%_45%] mx-auto shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-10">
            <div className="absolute top-5 -left-2 w-[30px] h-[30px] bg-white rounded-full -z-10" />
            <div className="absolute top-5 -right-2 w-[30px] h-[30px] bg-white rounded-full -z-10" />
            
            <div className="absolute top-[50px] left-10 w-[22px] h-[22px] bg-[#1a1a1a] rounded-full overflow-hidden">
              <div className="pupil absolute w-1.5 h-1.5 bg-white rounded-full top-1 left-2 transition-transform duration-100 ease-out"
                style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` }}
              />
            </div>
            <div className="absolute top-[50px] right-10 w-[22px] h-[22px] bg-[#1a1a1a] rounded-full overflow-hidden">
              <div className="pupil absolute w-1.5 h-1.5 bg-white rounded-full top-1 left-2 transition-transform duration-100 ease-out"
                style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` }}
              />
            </div>

            <div className={cn(
              "absolute top-[85px] left-1/2 -translate-x-1/2 w-[60px] h-[25px] bg-[#1a1a1a] rounded-b-[30px] overflow-hidden transition-all duration-300",
              isSad && "h-[10px] top-[95px] rounded-t-[30px] rounded-b-none"
            )}>
              {!isSad && <div className="absolute bottom-0 left-[10px] w-10 h-3 bg-[#e74c3c] rounded-t-full" />}
            </div>
          </div>
          <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-[170px] h-[45px] bg-primary rounded-[20px] z-20" />
          <div className={cn(
            "absolute bottom-[-40px] left-[15px] w-[45px] h-[100px] bg-white rounded-[25px] shadow-[0_5px_10px_rgba(0,0,0,0.3)] z-30 origin-bottom transition-all duration-500",
            isCoveringEyes ? "translate-y-[-95px] rotate-[35deg]" : "rotate-[-15deg]"
          )} />
          <div className={cn(
            "absolute bottom-[-40px] right-[15px] w-[45px] h-[100px] bg-white rounded-[25px] shadow-[0_5px_10px_rgba(0,0,0,0.3)] z-30 origin-bottom transition-all duration-500",
            isCoveringEyes ? "translate-y-[-95px] rotate-[35deg]" : "rotate-[15deg]"
          )} />
        </div>

        <div className="bg-[#1c1c1c] p-8 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative z-10 border border-white/5">
          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="text"
              placeholder="Q_ID"
              className="w-full h-14 bg-[#2a2a2a] border-2 border-transparent rounded-xl px-5 text-sm transition-all focus:border-primary focus:bg-[#222222] outline-none text-white"
              value={qid}
              onChange={(e) => { setQid(e.target.value); handleInputTrack(e.target.value); }}
              onFocus={() => { setIsSad(false); setIsCoveringEyes(false); setEyeOffset(prev => ({ ...prev, y: 8 })); }}
              onBlur={() => setEyeOffset({ x: 0, y: 0 })}
              required
            />
            
            <input
              type="password"
              placeholder="Password"
              className="w-full h-14 bg-[#2a2a2a] border-2 border-transparent rounded-xl px-5 text-sm transition-all focus:border-primary focus:bg-[#222222] outline-none text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => { setIsSad(false); setIsCoveringEyes(true); }}
              onBlur={() => setIsCoveringEyes(false)}
              required
            />

            <div className="space-y-3">
              <div className="flex gap-3 h-14">
                <button 
                  type="button" 
                  onClick={fetchCaptcha}
                  disabled={initStatus === 'loading'}
                  className="bg-[#2a2a2a] border-2 border-[#2a2a2a] rounded-xl w-14 flex items-center justify-center text-[#888] transition-all hover:text-primary hover:border-primary hover:bg-[#222] disabled:opacity-50"
                >
                  <RotateCw className={cn("w-5 h-5", initStatus === 'loading' && "animate-spin")} />
                </button>
                <div className="flex-grow rounded-xl flex items-center justify-center relative overflow-hidden bg-white select-none">
                  {captchaData ? (
                    <img 
                      src={captchaData.image} 
                      alt="Captcha" 
                      className="h-full w-full object-contain" 
                      onError={() => {
                        setErrorMessage("Rendering failed");
                        setInitializationStatus('error');
                      }}
                    />
                  ) : initStatus === 'error' ? (
                    <div className="flex flex-col items-center justify-center text-red-500 p-1">
                      <AlertCircle className="w-4 h-4 mb-1" />
                      <span className="text-[8px] font-bold text-center leading-tight uppercase">{errorMessage}</span>
                    </div>
                  ) : (
                    <div className="animate-pulse w-full h-full bg-muted flex items-center justify-center">
                       <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Pulse...</span>
                    </div>
                  )}
                </div>
              </div>
              <input 
                type="text" 
                placeholder="Enter Captcha" 
                className="w-full h-14 bg-[#2a2a2a] border-2 border-transparent rounded-xl px-5 text-sm transition-all focus:border-primary focus:bg-[#222222] outline-none text-white"
                value={captchaInput}
                onChange={(e) => { setCaptchaInput(e.target.value); handleInputTrack(e.target.value); }}
                onFocus={() => { setIsCoveringEyes(false); setEyeOffset(prev => ({ ...prev, y: 8 })); }}
                onBlur={() => setEyeOffset({ x: 0, y: 0 })}
                required
              />
            </div>

            <div className="flex items-center justify-end pt-2">
              <button 
                type="submit"
                disabled={isLoggingIn || initStatus !== 'success' || !transactionId}
                className="bg-primary text-black h-11 px-10 rounded-full font-bold text-sm transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-[0_10px_20px_rgba(250,204,21,0.2)]"
              >
                {isLoggingIn ? "Authenticating..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <p className="mt-12 text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
        &copy; 2025 PreRP Technologies. All Rights Reserved.
      </p>

      <style jsx>{`
        .covering-eyes .pupil { transform: translateY(-4px) !important; }
      `}</style>
    </div>
  )
}
