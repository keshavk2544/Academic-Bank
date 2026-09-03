
"use client"

import { useState, useEffect, use } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { GlassCard } from "@/components/glass-card"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { 
  Calendar, 
  Clock, 
  QrCode, 
  Trophy, 
  CheckCircle2,
  FileText,
  Bell,
  Sparkles,
  User,
  CreditCard,
  Hash,
  School,
  Library,
  BrainCircuit
} from "lucide-react"

export default function Dashboard(props: { params: Promise<any>; searchParams: Promise<any> }) {
  // Unwrap async props for Next.js 15 compatibility
  use(props.params);
  use(props.searchParams);

  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<string>("--:--:--");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column 1: Details and Actions */}
          <div className="space-y-6">
            {/* Student Info Card */}
            <GlassCard className="p-5 flex flex-col justify-between relative overflow-hidden group border-white/10 h-fit">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
              
              {/* Top Right Options */}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-muted-foreground hover:text-primary transition-all">
                  <Bell className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => router.push('/attendance')}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-muted-foreground hover:text-accent transition-all"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-inner">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-headline font-bold leading-none mb-1.5">Keshav Krishan</h3>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                    <School className="w-3 h-3" /> B.Tech CSE • Semester 6
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 hover:border-blue-500/20 transition-colors flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-blue-400 uppercase tracking-widest">
                    <Hash className="w-3 h-3" /> Roll No
                  </div>
                  <span className="text-sm font-headline font-medium">22CSE1042</span>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/20 transition-colors flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-purple-400 uppercase tracking-widest">
                    <CreditCard className="w-3 h-3" /> QID
                  </div>
                  <span className="text-sm font-headline font-medium">Q748291</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/20 transition-colors flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                    <Calendar className="w-3 h-3" /> Date
                  </div>
                  <span className="text-sm font-headline font-medium">May 15, 2025</span>
                </div>
                <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/10 hover:border-orange-500/20 transition-all flex flex-col items-center justify-center">
                  <span className="text-2xl font-headline font-bold text-orange-400 tabular-nums tracking-widest">
                    {currentTime}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                <button 
                  onClick={() => router.push('/attendance')}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Mark Attendance</span>
                </button>
                <div className="text-right flex flex-col items-end">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Avg Pulse</span>
                  <span className="text-2xl font-headline font-bold text-green-400 leading-none">87.5%</span>
                </div>
              </div>
            </GlassCard>

            {/* QUICK ACTIONS */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => router.push('/tools')}
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-[24px] glass border-white/10 hover:bg-primary/10 hover:border-primary/40 transition-all group shadow-xl"
              >
                <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/70 group-hover:text-white transition-colors">Start Quiz</span>
              </button>
              
              <button 
                onClick={() => router.push('/academics')}
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-[24px] glass border-white/10 hover:bg-accent/10 hover:border-accent/40 transition-all group shadow-xl"
              >
                <div className="p-3 rounded-2xl bg-accent/10 text-accent group-hover:scale-110 group-hover:bg-accent/20 transition-all">
                  <Library className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/70 group-hover:text-white transition-colors">Repository</span>
              </button>
            </div>
          </div>

          {/* Column 2 */}
          <div className="hidden md:block">
             <GlassCard className="h-full border-white/5 bg-white/5 flex flex-col items-center justify-center text-center p-8 opacity-40">
                <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
                <h4 className="text-sm font-bold uppercase tracking-widest mb-1">More Widgets Coming Soon</h4>
                <p className="text-xs text-muted-foreground">Customize your dashboard with upcoming interactive pulse-cards.</p>
             </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
