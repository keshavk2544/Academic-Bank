
"use client"

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
  User
} from "lucide-react"

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-headline font-bold">Welcome back, Alex.</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
            <Calendar className="w-4 h-4 text-accent" />
            <span>Mon, May 15, 2025</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student Info Card */}
          <GlassCard className="flex flex-col gap-3 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Student Profile</span>
              <User className="w-4 h-4 text-primary opacity-50" />
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Name</span>
                <span className="text-xs font-semibold">Alex Rivera</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Roll No</span>
                <span className="text-xs font-mono">22CSE1042</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">QID</span>
                <span className="text-xs font-mono">Q748291</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Course</span>
                <span className="text-xs font-medium text-right max-w-[120px] truncate">B.Tech CSE</span>
              </div>
              <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] text-accent uppercase font-bold tracking-tight">Attendance</span>
                <span className="text-xl font-headline font-bold text-accent">87.5%</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Trophy className="w-16 h-16" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Current Ranking</span>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-headline font-bold">#12</span>
              <span className="text-xs text-muted-foreground mb-1">/ 240 Students</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`h-1 flex-1 rounded-full ${i <= 4 ? "bg-accent" : "bg-white/10"}`} />
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground">Top 5% of your class. Stellar!</p>
          </GlassCard>

          <GlassCard className="flex flex-col gap-4 relative overflow-hidden group bg-primary/10 border-primary/30">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
              <QrCode className="w-16 h-16" />
            </div>
            <span className="text-sm font-medium text-primary">Attendance Pulse</span>
            <div className="flex-1 flex flex-col justify-center">
              <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-[0_0_15px_rgba(139,92,246,0.5)] active:scale-95 transition-all">
                Mark Attendance
              </button>
            </div>
            <p className="text-[10px] text-primary/70">Scan QR Code or enter OTP now.</p>
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

        {/* AI Insight Row */}
        <GlassCard className="p-6 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border-white/10 flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 rounded-full bg-white/10 border border-white/20 animate-float">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-headline font-bold mb-1">Academic Sage Insight</h3>
            <p className="text-sm text-muted-foreground max-w-2xl">
              I've noticed your "Machine Learning" assignments are due in 2 days. Would you like me to summarize the lecture notes for Chapter 4?
            </p>
          </div>
          <button className="px-6 py-2.5 bg-white text-black rounded-xl font-bold hover:bg-white/90 transition-all shadow-xl whitespace-nowrap">
            Assist Me
          </button>
        </GlassCard>
      </div>
    </DashboardLayout>
  )
}
