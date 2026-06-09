
"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { GlassCard } from "@/components/glass-card"
import { Progress } from "@/components/ui/progress"
import { 
  Calendar, 
  Clock, 
  QrCode, 
  Trophy, 
  ArrowUpRight, 
  CheckCircle2,
  FileText,
  AlertCircle,
  Bell,
  Sparkles,
  User,
  CreditCard,
  Hash,
  School
} from "lucide-react"

export default function Dashboard() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Info Card */}
          <GlassCard className="p-4 flex flex-col justify-between relative overflow-hidden group border-white/10">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
            
            {/* Top Right Options */}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-muted-foreground hover:text-primary transition-all">
                <Bell className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-muted-foreground hover:text-accent transition-all">
                <QrCode className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-inner">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-headline font-bold leading-none mb-1">Alex Rivera</h3>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest">
                  <School className="w-3 h-3" /> B.Tech CSE
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/10 hover:border-blue-500/20 transition-colors flex flex-col gap-0.5">
                <div className="flex items-center gap-1 text-[10px] font-bold text-blue-400 uppercase tracking-tighter">
                  <Hash className="w-2.5 h-2.5" /> Roll No
                </div>
                <span className="text-sm font-headline font-medium">22CSE1042</span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/20 transition-colors flex flex-col gap-0.5">
                <div className="flex items-center gap-1 text-[10px] font-bold text-purple-400 uppercase tracking-tighter">
                  <CreditCard className="w-2.5 h-2.5" /> QID
                </div>
                <span className="text-sm font-headline font-medium">Q748291</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/20 transition-colors flex flex-col gap-0.5">
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">
                  <Calendar className="w-2.5 h-2.5" /> Date
                </div>
                <span className="text-sm font-headline font-medium">May 15, 2025</span>
              </div>
              <div className="p-2.5 rounded-xl bg-orange-500/5 border border-orange-500/10 hover:border-orange-500/20 transition-all flex flex-col items-center justify-center">
                <span className="text-xl font-headline font-bold text-orange-400 tabular-nums tracking-widest">
                  {currentTime}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Attendance</span>
              </div>
              <span className="text-xl font-headline font-bold text-green-400">87.5%</span>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Schedule */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-headline font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" /> Upcoming Today
              </h3>
              <button className="text-xs text-primary font-semibold hover:underline">View Timetable</button>
            </div>
            <div className="space-y-3">
              {[
                { time: "10:30 AM", subject: "Deep Learning Fundamentals", room: "LT-402", type: "Lecture" },
                { time: "01:00 PM", subject: "Cloud Computing Lab", room: "Lab-3", type: "Practical" },
                { time: "03:15 PM", subject: "Professional Ethics", room: "Online", type: "Seminar" },
              ].map((session, idx) => (
                <GlassCard key={idx} className="p-4 flex items-center justify-between hover:translate-x-1 transition-transform border-l-4 border-l-accent">
                  <div className="flex gap-4 items-center">
                    <div className="text-center min-w-[70px]">
                      <p className="text-xs font-bold text-muted-foreground">{session.time.split(' ')[1]}</p>
                      <p className="text-lg font-headline font-bold text-accent">{session.time.split(' ')[0]}</p>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div>
                      <h4 className="font-semibold text-sm">{session.subject}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-accent" /> {session.room} • {session.type}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-white">
                    <Bell className="w-4 h-4" />
                  </button>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Critical Updates */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-headline font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" /> Critical Notices
              </h3>
              <button className="text-xs text-primary font-semibold hover:underline">See All</button>
            </div>
            <div className="space-y-3">
              <GlassCard className="p-5 border-l-4 border-l-red-500 bg-red-500/5 group hover:bg-red-500/10">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-red-500 text-[10px] font-bold uppercase tracking-wider">Urgent</span>
                  <span className="text-[10px] text-muted-foreground">2 hrs ago</span>
                </div>
                <h4 className="font-bold mb-1">Mid-Semester Exam Schedule Released</h4>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">The official schedule for the Semester 5 Mid-exams is now live. Check your respective department blocks.</p>
                <button className="flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                  View Document <ArrowUpRight className="w-3 h-3" />
                </button>
              </GlassCard>

              <GlassCard className="p-5 border-l-4 border-l-purple-500 bg-purple-500/5 group hover:bg-purple-500/10">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-purple-500 text-[10px] font-bold uppercase tracking-wider">Placement</span>
                  <span className="text-[10px] text-muted-foreground">Yesterday</span>
                </div>
                <h4 className="font-bold mb-1">Google Inc. - Virtual Info Session</h4>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">Register for the upcoming engineering recruitment drive for Batch 2026. Limited slots available.</p>
                <button className="flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                  Register Now <ArrowUpRight className="w-3 h-3" />
                </button>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
