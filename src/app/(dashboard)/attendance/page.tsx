
"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { GlassCard } from "@/components/glass-card"
import { Progress } from "@/components/ui/progress"
import { 
  QrCode, 
  Scan, 
  History, 
  TrendingUp, 
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle
} from "lucide-react"

export default function AttendancePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-1">Attendance Pulse</h2>
            <h1 className="text-3xl font-headline font-bold">Tracking & Analytics</h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Scanner Section */}
          <div className="lg:col-span-2 space-y-8">
            <GlassCard className="p-0 border-primary/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10" />
              <div className="p-8 flex flex-col items-center text-center">
                <div className="relative mb-8">
                  <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl border-2 border-dashed border-primary/50 flex items-center justify-center bg-white/5 relative overflow-hidden group-hover:border-primary transition-colors">
                    <QrCode className="w-32 h-32 md:w-48 md:h-48 text-primary/40 group-hover:text-primary transition-all duration-700" />
                    {/* Scanning Animation */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary/60 shadow-[0_0_15px_rgba(139,92,246,1)] animate-[scan_3s_ease-in-out_infinite]" />
                  </div>
                  <style jsx>{`
                    @keyframes scan {
                      0%, 100% { top: 0% }
                      50% { top: 100% }
                    }
                  `}</style>
                </div>
                
                <h3 className="text-2xl font-headline font-bold mb-2">QR Pulse Ready</h3>
                <p className="text-sm text-muted-foreground mb-8 max-w-sm">
                  Point your camera at the screen or scan the lecturer's temporary pulse code to verify your presence.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <button className="flex-1 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-[0_0_20px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2 group">
                    <Scan className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Initialize Scanner
                  </button>
                  <button className="flex-1 py-4 glass border-white/10 hover:bg-white/10 rounded-2xl font-bold text-sm">
                    Enter OTP Manually
                  </button>
                </div>
              </div>

              <div className="bg-white/5 p-4 border-t border-white/10 flex justify-around text-center">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Session IP</p>
                  <p className="text-xs font-mono">192.168.1.104</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Geo-Fence</p>
                  <p className="text-xs flex items-center gap-1 text-green-400 font-bold"><MapPin className="w-3 h-3" /> Active</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Expires In</p>
                  <p className="text-xs font-mono text-pink-400">01:42</p>
                </div>
              </div>
            </GlassCard>

            <div className="space-y-4">
              <h3 className="text-xl font-headline font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-accent" /> Recent Activity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { subject: "Machine Learning", date: "Today, 10:30 AM", status: "Present", icon: CheckCircle, color: "text-green-400" },
                  { subject: "Computer Networks", date: "Today, 09:00 AM", status: "Present", icon: CheckCircle, color: "text-green-400" },
                  { subject: "Cloud Computing", date: "Yesterday, 02:00 PM", status: "Late", icon: Clock, color: "text-yellow-400" },
                  { subject: "Professional Ethics", date: "Yesterday, 11:30 AM", status: "Present", icon: CheckCircle, color: "text-green-400" },
                ].map((item, idx) => (
                  <GlassCard key={idx} className="p-4 flex items-center gap-4 hover:translate-y-[-2px] transition-all">
                    <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate">{item.subject}</h4>
                      <p className="text-[10px] text-muted-foreground">{item.date}</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg bg-white/5 border border-white/10 ${item.color}`}>
                      {item.status}
                    </span>
                  </GlassCard>
                ))}
              </div>
            </div>
          </div>

          {/* Analytics Sidebar */}
          <div className="space-y-8">
            <GlassCard className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Statistics</h3>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Monthly Average</span>
                    <span className="font-bold">88%</span>
                  </div>
                  <Progress value={88} className="h-2 bg-white/10" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Total Classes</p>
                    <p className="text-2xl font-headline font-bold">142</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Attended</p>
                    <p className="text-2xl font-headline font-bold text-green-400">125</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Subject Analysis</h4>
                  {[
                    { sub: "Machine Learning", val: 92 },
                    { sub: "Computer Networks", val: 85 },
                    { sub: "Cloud Computing", val: 78 },
                    { sub: "DBMS", val: 95 },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs font-medium flex-1 truncate">{s.sub}</span>
                      <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden shrink-0">
                        <div className="h-full bg-primary" style={{ width: `${s.val}%` }} />
                      </div>
                      <span className="text-[10px] font-bold min-w-[30px]">{s.val}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 bg-accent/10 border-accent/20">
              <ShieldCheck className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-lg font-bold mb-2">Proxy Protection</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Our AI detects irregular patterns. Continuous accurate check-ins maintain your trust score and unlock premium study perks.
              </p>
              <button className="w-full py-2.5 text-xs font-bold text-accent border border-accent/30 rounded-xl hover:bg-accent/20 transition-all">
                Learn More
              </button>
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
