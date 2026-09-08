
"use client"

import { useState, useEffect, use } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useRouter } from "next/navigation"
import { 
  BrainCircuit, 
  Library,
  Eye,
  Download,
  SlidersHorizontal
} from "lucide-react"
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
        {/* Inspiration Header: Centered Image overlapping Yellow Box */}
        <header className="px-6 pt-12 flex flex-col items-center">
          <div className="relative z-10 -mb-12">
            <div className="w-32 h-32 rounded-full border-[6px] border-black overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/keshav/200" 
                alt="Profile" 
                className="w-full h-full object-cover"
                data-ai-hint="student profile"
              />
            </div>
          </div>
          
          <div className="bg-primary w-full rounded-[3.5rem] pt-16 pb-8 text-center text-black px-6 shadow-xl relative overflow-hidden">
             <h1 className="text-3xl font-headline font-black tracking-tighter leading-none mb-1">Keshav Krishan</h1>
             <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Admin</p>
          </div>
        </header>

        {/* Main Content */}
        <div className="px-6 mt-16 space-y-10">
          {/* Recently Searched Style Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold font-headline tracking-tight">Academic Hub</h2>
              <SlidersHorizontal className="w-5 h-5 opacity-40" />
            </div>

            <div className="space-y-4">
              {/* Item 1 */}
              <div className="bg-card p-4 rounded-[2.5rem] flex items-center justify-between border border-white/5">
                <div className="pl-2">
                  <h3 className="text-sm font-bold">AI Quiz Engine</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Status: Active</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => router.push('/tools')}
                    className="w-14 h-14 rounded-2xl bg-primary flex flex-col items-center justify-center text-black gap-1 transition-transform active:scale-90"
                  >
                    <Eye className="w-5 h-5" />
                    <span className="text-[8px] font-black uppercase">Start</span>
                  </button>
                  <button className="w-14 h-14 rounded-2xl bg-destructive flex flex-col items-center justify-center text-white gap-1 transition-transform active:scale-90">
                    <BrainCircuit className="w-5 h-5" />
                    <span className="text-[8px] font-black uppercase">Aids</span>
                  </button>
                </div>
              </div>

              {/* Item 2 */}
              <div className="bg-card p-4 rounded-[2.5rem] flex items-center justify-between border border-white/5">
                <div className="pl-2">
                  <h3 className="text-sm font-bold">Academic Vault</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Repository Sync: Enabled</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => router.push('/academics')}
                    className="w-14 h-14 rounded-2xl bg-primary flex flex-col items-center justify-center text-black gap-1 transition-transform active:scale-90"
                  >
                    <Library className="w-5 h-5" />
                    <span className="text-[8px] font-black uppercase">Browse</span>
                  </button>
                  <button className="w-14 h-14 rounded-2xl bg-destructive flex flex-col items-center justify-center text-white gap-1 transition-transform active:scale-90">
                    <Download className="w-5 h-5" />
                    <span className="text-[8px] font-black uppercase">Vault</span>
                  </button>
                </div>
              </div>
            </div>

            <button className="w-full py-4 bg-primary rounded-[2rem] text-black font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-transform active:scale-95">
              View Full Hub
            </button>
          </section>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card p-6 rounded-[2.5rem] border border-white/5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-4 block">Attendance</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-headline font-black text-primary">87</span>
                <span className="text-xs font-bold text-primary/60">%</span>
              </div>
            </div>
            <div className="bg-card p-6 rounded-[2.5rem] border border-white/5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-4 block">Time Pulse</span>
              <span className="text-3xl font-headline font-black tracking-tighter">{currentTime}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
