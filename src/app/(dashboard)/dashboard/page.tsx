
"use client"

import { useState, useEffect, use } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useRouter } from "next/navigation"
import { 
  Wifi
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
        {/* Header: Shifted upward significantly */}
        <header className="px-6 pt-4 flex flex-col items-center">
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
