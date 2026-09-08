
"use client"

import { useState, useEffect, use } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { 
  Search,
  BrainCircuit, 
  Library,
  ChevronRight,
  Clock,
  Scan,
  User,
  LayoutGrid
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function Dashboard(props: { params: Promise<any>; searchParams: Promise<any> }) {
  use(props.params);
  use(props.searchParams);

  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<string>("--:--");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-black text-white pb-32">
        {/* Top Header Section - Redesigned for openness */}
        <header className="bg-primary text-black rounded-b-[4rem] px-8 pt-12 pb-20 relative transition-all duration-500">
          <div className="flex items-center justify-between mb-16">
            <div className="bg-black/5 p-2.5 rounded-2xl hover:bg-black/10 transition-colors cursor-pointer">
              <LayoutGrid className="w-7 h-7" />
            </div>
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-[3px] border-black/10 shadow-2xl transition-transform hover:scale-105 active:scale-95">
              <img 
                src="https://picsum.photos/seed/student/200" 
                alt="Profile" 
                className="w-full h-full object-cover"
                data-ai-hint="student profile"
              />
            </div>
          </div>

          <div className="mb-12 animate-in fade-in slide-in-from-left-4 duration-700">
            <p className="text-black/50 font-bold uppercase text-[10px] tracking-[0.4em] mb-4">Academic Command Center</p>
            <h1 className="text-6xl font-headline font-black tracking-tighter leading-[0.9] flex flex-col">
              <span>Hello,</span>
              <span className="text-black/80">Keshav</span>
            </h1>
          </div>

          <div className="relative group max-w-2xl">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none z-10">
              <Search className="text-white/20 group-focus-within:text-primary transition-colors w-6 h-6" />
            </div>
            <Input 
              placeholder="Search repository, quizzes..." 
              className="w-full rounded-full bg-black text-white border-none h-20 pl-16 text-xl placeholder:text-white/20 shadow-2xl focus-visible:ring-4 focus-visible:ring-black/10 transition-all"
            />
          </div>
        </header>

        {/* Main Content Sections */}
        <div className="px-6 -mt-10 space-y-10 relative z-20">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-card p-8 rounded-[3rem] flex flex-col justify-between h-48 border border-white/5 shadow-xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Attendance</span>
              <div>
                <span className="text-4xl font-headline font-bold text-primary">87.5%</span>
                <Progress value={87.5} className="h-1.5 bg-white/5 mt-4" />
              </div>
            </div>
            <div className="bg-card p-8 rounded-[3rem] flex flex-col justify-between h-48 border border-white/5 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Local Time</span>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
              </div>
              <span className="text-4xl font-headline font-bold tracking-tight">{currentTime}</span>
            </div>
          </div>

          {/* List of Actions */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-bold font-headline tracking-tight">Academic Hub</h2>
              <button className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 hover:opacity-100 transition-opacity">Manage</button>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => router.push('/tools')}
                className="card-item w-full hover:translate-x-2 transition-transform duration-300"
              >
                <div className="text-left">
                  <h3 className="text-lg font-bold">AI Quiz Engine</h3>
                  <p className="text-sm text-muted-foreground">Convert notes into smart cards</p>
                </div>
                <div className="icon-box shadow-lg shadow-primary/20">
                  <BrainCircuit className="w-6 h-6" />
                </div>
              </button>

              <button 
                onClick={() => router.push('/academics')}
                className="card-item w-full hover:translate-x-2 transition-transform duration-300"
              >
                <div className="text-left">
                  <h3 className="text-lg font-bold">Study Vault</h3>
                  <p className="text-sm text-muted-foreground">Access shared academic assets</p>
                </div>
                <div className="icon-box shadow-lg shadow-primary/20">
                  <Library className="w-6 h-6" />
                </div>
              </button>

              <button 
                onClick={() => router.push('/attendance')}
                className="card-item w-full hover:translate-x-2 transition-transform duration-300"
              >
                <div className="text-left">
                  <h3 className="text-lg font-bold">Pulse Scanner</h3>
                  <p className="text-sm text-muted-foreground">Biometric presence verification</p>
                </div>
                <div className="icon-box shadow-lg shadow-primary/20">
                  <Scan className="w-6 h-6" />
                </div>
              </button>
            </div>
          </section>

          {/* Recently Viewed */}
          <section className="space-y-6">
             <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-bold font-headline tracking-tight">Intelligence Feed</h2>
              <ChevronRight className="w-5 h-5 opacity-30" />
            </div>
            <div className="card-item hover:bg-muted/80 transition-colors">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-bold">Identity Profile</h4>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Updated 2 days ago</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-black shadow-lg shadow-primary/20 cursor-pointer active:scale-90 transition-transform">
                   <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}
